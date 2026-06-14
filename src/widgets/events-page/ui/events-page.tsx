"use client";

import { useAppSelector } from "@/store/hooks";
import { MuseumEventsTab } from "@/widgets/museum-detail-page/ui/tabs/museum-events-tab";
import { PageHeader } from "@/shared/ui/page-header";
import { isEventManager } from "@/shared/lib/rbac/types";

export function EventsPage() {
  const museumId = useAppSelector((s) => s.session.museumId);
  const role = useAppSelector((s) => s.session.role);

  if (!museumId || !role) return null;

  const canManage = isEventManager(role);

  return (
    <div>
      <PageHeader
        title="События"
        description={canManage ? undefined : "Просмотр событий музея"}
      />
      <MuseumEventsTab museumId={museumId} canManage={canManage} />
    </div>
  );
}
