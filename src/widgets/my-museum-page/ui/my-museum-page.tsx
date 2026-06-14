"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { museumApi } from "@/entities/museum/api/museum-api";
import { museumQueryKeys } from "@/entities/museum/api/query-keys";
import { MuseumProfileTab } from "@/widgets/museum-detail-page/ui/tabs/museum-profile-tab";
import { PageHeader } from "@/shared/ui/page-header";

export function MyMuseumPage() {
  const museumId = useAppSelector((s) => s.session.museumId);

  const { data: museum, isLoading } = useQuery({
    queryKey: museumQueryKeys.detail(museumId!),
    queryFn: () => museumApi.byId(museumId!),
    enabled: !!museumId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!museum) return null;

  return (
    <div>
      <PageHeader
        title={museum.name}
        description="Профиль вашего музея"
      />
      <MuseumProfileTab museum={museum} isSuperAdmin={false} />
    </div>
  );
}
