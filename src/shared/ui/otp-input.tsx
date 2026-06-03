"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  id?: string;
  variant?: "default" | "glass";
};

export function OtpInput({
  value,
  onChange,
  disabled,
  error,
  autoFocus = true,
  id = "otp",
  variant = "default",
}: OtpInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  const focusAt = (index: number) => {
    const el = inputsRef.current[Math.min(index, OTP_LENGTH - 1)];
    el?.focus();
    el?.select();
  };

  const commitDigits = (next: string[]) => {
    const cleaned = next.join("").replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(cleaned);
    if (cleaned.length < OTP_LENGTH) {
      focusAt(cleaned.length);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits.map((d) => (d === " " ? "" : d))];
    next[index] = digit;
    commitDigits(next);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits.map((d) => (d === " " ? "" : d))];
      if (next[index]) {
        next[index] = "";
        commitDigits(next);
      } else if (index > 0) {
        next[index - 1] = "";
        commitDigits(next);
        focusAt(index - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    onChange(pasted);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  React.useEffect(() => {
    if (autoFocus && !disabled) {
      focusAt(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  return (
    <div
      className="flex justify-center gap-2 sm:gap-2.5"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      {Array.from({ length: OTP_LENGTH }).map((_, index) => {
        const filled = digits[index] !== " " && digits[index] !== "";

        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            id={`${id}-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            aria-label={`Цифра ${index + 1} из ${OTP_LENGTH}`}
            aria-invalid={error}
            value={digits[index] === " " ? "" : digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-10 rounded-lg border text-center text-lg font-semibold transition-colors sm:h-14 sm:w-12 sm:text-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive/30",
              variant === "default" && [
                "border-input bg-background shadow-sm focus-visible:ring-ring",
                filled && "border-primary/50",
              ],
              variant === "glass" && [
                "border-stone-200/70 bg-white/55 text-stone-900 shadow-inner backdrop-blur-md",
                "focus-visible:ring-stone-400/30",
                filled && "border-primary/40 bg-white/70",
              ],
            )}
          />
        );
      })}
    </div>
  );
}
