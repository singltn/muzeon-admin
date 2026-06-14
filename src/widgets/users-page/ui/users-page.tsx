"use client";

import { useAppSelector } from "@/store/hooks";
import { MuseumUsersTab } from "@/widgets/museum-detail-page/ui/tabs/museum-users-tab";
import { PageHeader } from "@/shared/ui/page-header";

export function UsersPage() {
  const museumId = useAppSelector((s) => s.session.museumId);

  if (!museumId) return null;

  return (
    <div>
      <PageHeader
        title="Пользователи"
        description="Сотрудники вашего музея"
      />
      <MuseumUsersTab museumId={museumId} />
    </div>
  );
}
