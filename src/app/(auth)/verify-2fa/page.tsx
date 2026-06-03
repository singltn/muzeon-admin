import { Suspense } from "react";
import { Verify2faForm } from "@/features/auth/verify-2fa/ui/verify-2fa-form";
import { AuthScreen } from "@/widgets/auth-screen/ui/auth-screen";

function Verify2faFallback() {
  return (
    <AuthScreen title="Код из письма" subtitle="Загрузка…">
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </AuthScreen>
  );
}

export const metadata = {
  title: "Код подтверждения — Muzeon Admin",
};

export default function Verify2faPage() {
  return (
    <Suspense fallback={<Verify2faFallback />}>
      <Verify2faForm />
    </Suspense>
  );
}
