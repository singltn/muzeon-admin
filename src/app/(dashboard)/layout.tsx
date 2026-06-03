import { AppShell } from "@/widgets/app-shell/ui/app-shell";
import { SessionHydrator } from "@/features/auth/session-hydrator/ui/session-hydrator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionHydrator>
      <AppShell>{children}</AppShell>
    </SessionHydrator>
  );
}
