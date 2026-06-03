"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { verify2faApi } from "../api/verify-2fa-api";
import { authPending } from "@/features/auth/lib/auth-pending";
import { maskEmail } from "@/shared/lib/mask-email";
import { AuthScreen } from "@/widgets/auth-screen/ui/auth-screen";
import { OtpInput } from "@/shared/ui/otp-input";
import { Button } from "@/shared/ui/button";

const RESEND_COOLDOWN_SEC = 60;

export function Verify2faForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const challengeId =
    searchParams.get("challenge") ?? authPending.getChallenge() ?? "";
  const email =
    searchParams.get("email") ?? authPending.getEmail() ?? "";

  const [code, setCode] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = React.useState(RESEND_COOLDOWN_SEC);
  const lastSubmittedRef = React.useRef("");

  React.useEffect(() => {
    if (!challengeId || !email) {
      router.replace("/login");
    }
  }, [challengeId, email, router]);

  React.useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  const verifyMutation = useMutation({
    mutationFn: (otp: string) =>
      verify2faApi.verify({ challengeId, code: otp }),
    onSuccess: () => {
      authPending.clear();
      router.push("/");
    },
    onError: () => {
      setFieldError("Неверный или просроченный код. Запросите новый.");
      setCode("");
      lastSubmittedRef.current = "";
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => verify2faApi.resend({ challengeId }),
    onSuccess: () => {
      setResendSeconds(RESEND_COOLDOWN_SEC);
      setFieldError(null);
      setCode("");
      lastSubmittedRef.current = "";
    },
  });

  const submitCode = React.useCallback(
    (otp: string) => {
      if (otp.length !== 6 || verifyMutation.isPending) return;
      if (lastSubmittedRef.current === otp) return;
      lastSubmittedRef.current = otp;
      verifyMutation.mutate(otp);
    },
    [verifyMutation],
  );

  React.useEffect(() => {
    if (code.length === 6) {
      submitCode(code);
    }
  }, [code, submitCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (code.length !== 6) {
      setFieldError("Введите все 6 цифр кода");
      return;
    }

    lastSubmittedRef.current = "";
    submitCode(code);
  };

  const isBusy = verifyMutation.isPending || resendMutation.isPending;
  const masked = email ? maskEmail(email) : "вашу почту";

  if (!challengeId || !email) {
    return null;
  }

  return (
    <AuthScreen
      title="Код из письма"
      subtitle={
        <>
          Введите 6 цифр, отправленных на{" "}
          <span className="font-medium text-stone-800">{masked}</span>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-3">
          <OtpInput
            id="otp"
            variant="glass"
            value={code}
            onChange={(v) => {
              setCode(v);
              setFieldError(null);
              if (v.length < 6) {
                lastSubmittedRef.current = "";
              }
            }}
            disabled={isBusy}
            error={!!fieldError}
            autoFocus
          />
          {fieldError && (
            <p className="text-center text-sm text-destructive" role="alert">
              {fieldError}
            </p>
          )}
        </div>

        {verifyMutation.isPending && (
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Проверяем код…
          </div>
        )}

        <div className="text-center">
          {resendSeconds > 0 ? (
            <p className="text-sm text-stone-600">
              Отправить код повторно через{" "}
              <span className="font-medium tabular-nums text-stone-800">
                {resendSeconds}
              </span>{" "}
              сек
            </p>
          ) : (
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
              disabled={resendMutation.isPending}
              onClick={() => resendMutation.mutate()}
            >
              {resendMutation.isPending ? "Отправляем…" : "Отправить код повторно"}
            </button>
          )}
          {resendMutation.isError && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              Не удалось отправить код. Попробуйте позже.
            </p>
          )}
        </div>

        <Link
          href="/login"
          className="flex min-h-11 items-center justify-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
          onClick={() => authPending.clear()}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Другой аккаунт
        </Link>
      </form>
    </AuthScreen>
  );
}
