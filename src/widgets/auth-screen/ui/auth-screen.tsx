import type { ReactNode } from "react";
import authBg from "@/assets/auth-bg.png";
import { cn } from "@/shared/lib/utils";

type AuthScreenProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
};

const glassPanelClass = cn(
  "relative w-full max-w-[400px] overflow-hidden rounded-2xl",
  "border border-white/60",
  "bg-white/45 shadow-[0_8px_40px_rgba(15,23,42,0.12)]",
  "backdrop-blur-2xl backdrop-saturate-150",
  "supports-[backdrop-filter]:bg-white/35",
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
  "before:bg-gradient-to-br before:from-white/80 before:via-white/25 before:to-white/10",
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px",
  "after:bg-gradient-to-r after:from-transparent after:via-white/90 after:to-transparent",
);

const glassFormClass = cn(
  "[&_label]:text-stone-700",
  "[&_input]:border-stone-200/70 [&_input]:bg-white/55 [&_input]:text-stone-900",
  "[&_input]:shadow-inner [&_input]:backdrop-blur-md",
  "[&_input]:placeholder:text-stone-400",
  "[&_input]:focus-visible:ring-stone-400/30",
  "[&_button[type=submit]]:border-[#0d2350] [&_button[type=submit]]:bg-[#0d2350] [&_button[type=submit]]:text-white",
  "[&_button[type=submit]]:shadow-sm [&_button[type=submit]]:hover:bg-[#0d2350]/90",
  "[&_button[type=submit]]:active:bg-[#0d2350]/80",
  "[&_button[type=submit]]:focus-visible:ring-[#0d2350]/35",
);

export function AuthScreen({
  title,
  subtitle,
  children,
  className,
}: AuthScreenProps) {
  return (
    <div className="relative min-h-[100dvh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={authBg.src}
        alt=""
        className="fixed inset-0 -z-20 h-full w-full object-cover object-center"
        draggable={false}
      />
      {/* Лёгкий градиент для читаемости на светлом интерьере */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-900/20"
        aria-hidden
      />

      <div
        className={cn(
          "flex min-h-[100dvh] items-center justify-center px-4 py-6 sm:px-6",
          "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
          "pt-[max(1.5rem,env(safe-area-inset-top))]",
        )}
      >
        <div className={cn(glassPanelClass, className)}>
          <div className={cn("relative p-6 sm:p-8", glassFormClass)}>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-stone-500 sm:text-xs">
              МУЗЕОН
            </p>

            <header className="mb-5 mt-4">
              <h1 className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm leading-snug text-stone-600">
                  {subtitle}
                </p>
              )}
            </header>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
