"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { exhibitionApi } from "@/entities/exhibition/api/exhibition-api";
import { exhibitionQueryKeys } from "@/entities/exhibition/api/query-keys";
import { StatusBadge } from "@/shared/ui/status-badge";
import { ContentTypeLabel } from "@/shared/ui/content-type-label";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { formatDate } from "@/shared/lib/format";
import { PermissionGate } from "@/features/rbac/permission-gate/ui/permission-gate";

export function ExhibitionDetailPage({
  exhibitionId,
}: {
  exhibitionId: string;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: exhibitionQueryKeys.detail(exhibitionId),
    queryFn: () => exhibitionApi.byId(exhibitionId),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Загрузка…</p>;
  }
  if (!data) {
    return <p className="text-sm text-destructive">Событие не найдено</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={data.status} />
            <ContentTypeLabel type={data.type} />
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {data.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(data.startsAt)} — {formatDate(data.endsAt)}
          </p>
        </div>
        <PermissionGate permission="exhibitions:write">
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                Удалить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Удалить событие?</DialogTitle>
                <DialogDescription>
                  Действие необратимо. «{data.title}» будет удалено из каталога.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Отмена
                </Button>
                <Button variant="destructive">Удалить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>
    </div>
  );
}
