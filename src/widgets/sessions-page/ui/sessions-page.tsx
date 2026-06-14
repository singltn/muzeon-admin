"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Monitor, Trash2 } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { sessionApi } from "@/entities/session/api/session-api";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";

const SESSION_QUERY_KEY = ["sessions"];

export function SessionsPage() {
  const queryClient = useQueryClient();
  const [page] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: [...SESSION_QUERY_KEY, page],
    queryFn: () =>
      sessionApi.list({ offset: page * 20, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sessionApi.remove(id),
    onSuccess: () => {
      toastSuccess("Сессия завершена");
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
    onError: toastApiError,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Загрузка…</div>;
  }

  const sessions = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Активные сессии"
        description="Список устройств с открытыми сессиями"
      />
      <div className="space-y-3 max-w-2xl">
        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">Нет активных сессий</p>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-background px-4 py-3 shadow-sm"
          >
            <Monitor className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user_agent}</p>
              <p className="text-xs text-muted-foreground">
                {session.ip_address} ·{" "}
                {new Date(session.last_active_at).toLocaleString("ru")}
              </p>
            </div>
            {session.is_current ? (
              <Badge variant="success">Текущая</Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(session.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
