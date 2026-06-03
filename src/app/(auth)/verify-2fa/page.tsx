import { Suspense } from "react";
import { Verify2faForm } from "@/features/auth/verify-2fa/ui/verify-2fa-form";

export default function Verify2faPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Загрузка…</p>}>
      <Verify2faForm />
    </Suspense>
  );
}
