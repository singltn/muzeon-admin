"use client";

import { BarChart3, Ticket, Users, Wallet } from "lucide-react";
import { StatCard } from "@/widgets/stat-card/ui/stat-card";
import { formatNumber, formatRub } from "@/shared/lib/format";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Info } from "lucide-react";

/** Демо-метрики до подключения API аналитики */
const DEMO_STATS = {
  ticketsSold: 12480,
  revenue: 2_450_000,
  users: 842,
  eventsActive: 24,
};

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Обзор</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ключевые показатели платформы монетизации
        </p>
      </div>

      <Alert variant="info">
        <Info className="h-4 w-4 shrink-0" />
        <AlertTitle>Демо-данные</AlertTitle>
        <AlertDescription>
          Метрики ниже — заглушки по макету Design System v1.0. После подключения
          API замените на запросы в <code className="text-xs">widgets/dashboard-overview</code>.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Продано билетов"
          value={formatNumber(DEMO_STATS.ticketsSold)}
          icon={Ticket}
        />
        <StatCard
          label="Общий доход"
          value={formatRub(DEMO_STATS.revenue)}
          icon={Wallet}
          iconClassName="bg-chart-1/10 [&_svg]:text-chart-1"
        />
        <StatCard
          label="Пользователи"
          value={formatNumber(DEMO_STATS.users)}
          icon={Users}
        />
        <StatCard
          label="Активные события"
          value={String(DEMO_STATS.eventsActive)}
          icon={BarChart3}
        />
      </div>
    </div>
  );
}
