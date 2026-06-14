"use client";

import { useAppSelector } from "@/store/hooks";
import { MuseumLocationsTab } from "@/widgets/museum-detail-page/ui/tabs/museum-locations-tab";
import { PageHeader } from "@/shared/ui/page-header";
import { isEventManager } from "@/shared/lib/rbac/types";

export function LocationsPage() {
  const museumId = useAppSelector((s) => s.session.museumId);
  const role = useAppSelector((s) => s.session.role);

  if (!museumId || !role) return null;

  const canManage = isEventManager(role);

  return (
    <div>
      <PageHeader
        title="Площадки"
        description={canManage ? undefined : "Просмотр площадок музея"}
      />
      <MuseumLocationsTab museumId={museumId} canManage={canManage} />
    </div>
  );
}
