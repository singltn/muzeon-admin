"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Monitor, Smartphone, Tablet, Trash2, Bot } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { sessionApi } from "@/entities/session/api/session-api";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";
import { formatDatetime } from "@/shared/lib/format-date";
import { detectDevice, parseUserAgent } from "@/shared/lib/device-type";

const SESSION_QUERY_KEY = ["sessions"];

const DeviceIcon = ({ ua }: { ua: string }) => {
  const type = detectDevice(ua);
  const cls = "h-5 w-5 shrink-0 text-muted-foreground";
  if (type === "mobile") return <Smartphone className={cls} />;
  if (type === "tablet") return <Tablet className={cls} />;
  if (type === "bot") return <Bot className={cls} />;
  return <Monitor className={cls} />;
};

export function SessionsPage() {
  const queryClient = useQueryClient();
  const [page] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: [...SESSION_QUERY_KEY, page],
    queryFn: () => sessionApi.list({ offset: page * 20, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sessionApi.remove(id),
    onSuccess: () => {
      toastSuccess("Сессия завершена");
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
    onError: toastApiError,
  });

  const sessions = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Активные сессии"
        description="Устройства с открытыми сессиями"
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">Нет активных сессий</p>
      )}

      <div className="max-w-2xl space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-start gap-4 rounded-xl border border-border bg-background px-4 py-3.5 shadow-sm"
          >
            <div className="mt-0.5">
              <DeviceIcon ua={session.user_agent} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">
                {parseUserAgent(session.user_agent)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {session.ip_address}
              </p>
              <p className="text-xs text-muted-foreground">
                Вход: {formatDatetime(session.created_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                Активность: {formatDatetime(session.last_active_at)}
              </p>
            </div>
            <div className="shrink-0">
              {session.is_current ? (
                <Badge variant="success">Текущая</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(session.id)}
                  disabled={deleteMutation.isPending}
                  className="gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Завершить</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
