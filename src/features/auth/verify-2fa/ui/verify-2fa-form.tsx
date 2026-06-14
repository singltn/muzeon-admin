"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { verify2faApi } from "../api/verify-2fa-api";
import { authPending } from "@/features/auth/lib/auth-pending";
import { maskEmail } from "@/shared/lib/mask-email";
import { setSessionMarker } from "@/shared/lib/session-marker";
import { AuthScreen } from "@/widgets/auth-screen/ui/auth-screen";
import { OtpInput } from "@/shared/ui/otp-input";

export function Verify2faForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email") ?? authPending.getEmail() ?? "";

  const [code, setCode] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const lastSubmittedRef = React.useRef("");

  React.useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  const verifyMutation = useMutation({
    mutationFn: (otp: string) =>
      verify2faApi.verify({ email, otp }),
    onSuccess: () => {
      authPending.clear();
      setSessionMarker();
      router.push("/");
    },
    onError: () => {
      setFieldError("Неверный или просроченный код. Запросите новый.");
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

  const masked = email ? maskEmail(email) : "вашу почту";

  if (!email) return null;

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
      <div className="space-y-5">
        <OtpInput
          id="otp"
          variant="glass"
          value={code}
          onChange={(v) => {
            setCode(v);
            setFieldError(null);
            if (v.length < 6) lastSubmittedRef.current = "";
          }}
          disabled={verifyMutation.isPending}
          error={!!fieldError}
          autoFocus
        />

        {fieldError && (
          <p className="text-center text-sm text-destructive" role="alert">
            {fieldError}
          </p>
        )}

        {verifyMutation.isPending && (
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Проверяем код…
          </div>
        )}

        <Link
          href="/login"
          className="flex min-h-11 items-center justify-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
          onClick={() => authPending.clear()}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Другой аккаунт
        </Link>
      </div>
    </AuthScreen>
  );
}
