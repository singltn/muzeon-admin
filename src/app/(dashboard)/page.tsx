"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getDefaultRoute } from "@/shared/lib/rbac/types";

export default function DashboardRootPage() {
  const router = useRouter();
  const role = useAppSelector((s) => s.session.role);
  const status = useAppSelector((s) => s.session.status);

  useEffect(() => {
    if (status === "authenticated" && role) {
      router.replace(getDefaultRoute(role));
    }
  }, [status, role, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
