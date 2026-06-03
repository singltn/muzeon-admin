"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormValues } from "../model/schemas";
import { loginApi } from "../api/login-api";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";
import { authPending } from "@/features/auth/lib/auth-pending";
import { AuthScreen } from "@/widgets/auth-screen/ui/auth-screen";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/password-input";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: loginApi.login,
    onSuccess: (data, variables) => {
      if (data.status === "2fa_required") {
        dispatch(sessionActions.setPending2fa());
        authPending.set(variables.email, data.challengeId);
        const params = new URLSearchParams({
          challenge: data.challengeId,
          email: variables.email,
        });
        router.push(`/verify-2fa?${params.toString()}`);
        return;
      }
      authPending.clear();
      router.push("/");
    },
  });

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <AuthScreen title="Вход">
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Электронная почта</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            placeholder="name@museum.ru"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            disabled={mutation.isPending}
            {...form.register("email")}
          />
          {emailError && (
            <p id="email-error" className="text-sm text-destructive" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
            disabled={mutation.isPending}
            {...form.register("password")}
          />
          {passwordError && (
            <p id="password-error" className="text-sm text-destructive" role="alert">
              {passwordError}
            </p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-center text-sm text-destructive" role="alert">
            Неверная почта или пароль. Проверьте данные и попробуйте снова.
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full text-base"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Вход…
            </>
          ) : (
            "Войти"
          )}
        </Button>
      </form>
    </AuthScreen>
  );
}
