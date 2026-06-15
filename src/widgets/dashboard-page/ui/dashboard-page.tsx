"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import {
  dashboardApi,
  dashboardQueryKeys,
} from "@/entities/dashboard/api/dashboard-api";
import type {
  SuperAdminDashboardResponse,
  MuseumAdminDashboardResponse,
  MuseumStaffDashboardResponse,
  UpcomingEventItem,
} from "@/entities/dashboard/model/types";
import { PageHeader } from "@/shared/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { EventStatusBadge, MuseumStatusBadge } from "@/shared/ui/status-badge";
import { formatDatetime } from "@/shared/lib/format-date";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  premium: "Premium",
};

// ─── Shared components ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: "green" | "yellow" | "red" | "blue";
}) {
  const colorMap = {
    green: "text-emerald-600",
    yellow: "text-amber-600",
    red: "text-rose-600",
    blue: "text-blue-600",
    default: "text-muted-foreground",
  };
  const iconColor = colorMap[accent ?? "default"];

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </CardContent>
    </Card>
  );
}

function UpcomingEvents({ events }: { events: UpcomingEventItem[] }) {
  if (!events.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ближайшие события</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Нет предстоящих событий</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ближайшие события</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{ev.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDatetime(ev.date_start)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EventStatusBadge status={ev.status} />
                {ev.capacity > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {ev.occupied ?? 0}/{ev.capacity}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Role-specific dashboards ─────────────────────────────────────────────────

function SuperAdminDashboard({ data }: { data: SuperAdminDashboardResponse }) {
  const totalMuseums = data.museums.total;
  const totalSubscriptions = data.subscriptions.by_plan.reduce(
    (s, p) => s + p.count,
    0,
  );
  const problemCount = data.problem_museums.length;
  const expiringCount = data.expiring_subscriptions.length;

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Количество музеев" value={totalMuseums} icon={Building2} accent="blue" />
        <StatCard
          label="Количество подписок"
          value={totalSubscriptions}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Проблемных"
          value={problemCount}
          icon={AlertTriangle}
          accent={problemCount > 0 ? "red" : "green"}
        />
        <StatCard
          label="Истекает подписка"
          value={expiringCount}
          icon={Clock}
          accent={expiringCount > 0 ? "yellow" : "green"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* By status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Статус музеев</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.museums.by_status.map((item) => (
                <li
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <MuseumStatusBadge status={item.status} />
                  <span className="text-sm font-semibold">{item.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* By plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Распределение по тарифу</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.subscriptions.by_plan.map((item) => (
                <li
                  key={item.plan}
                  className="flex items-center justify-between"
                >
                  <Badge variant="secondary">
                    {PLAN_LABELS[item.plan] ?? item.plan}
                  </Badge>
                  <span className="text-sm font-semibold">{item.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Top museums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Топ по событиям
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.top_museums_by_events.length === 0 ? (
              <p className="px-5 py-3 text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ul className="divide-y">
                {data.top_museums_by_events.map((m, i) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between px-5 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <Link
                        href={`/museums/${m.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {m.name}
                      </Link>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {m.events_count} соб.
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Problem museums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Проблемные музеи
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.problem_museums.length === 0 ? (
              <p className="px-5 py-3 text-sm text-muted-foreground">Всё в порядке</p>
            ) : (
              <ul className="divide-y">
                {data.problem_museums.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between px-5 py-2.5"
                  >
                    <Link
                      href={`/museums/${m.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {m.name}
                    </Link>
                    <MuseumStatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expiring subscriptions */}
      {data.expiring_subscriptions.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
              <CalendarClock className="h-4 w-4" />
              Истекающие подписки
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-amber-200 dark:divide-amber-800">
              {data.expiring_subscriptions.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/museums/${m.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {m.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Тариф: {PLAN_LABELS[m.subscription_plan] ?? m.subscription_plan}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    До {formatDatetime(m.subscription_end_date)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MuseumAdminDashboard({
  data,
}: {
  data: MuseumAdminDashboardResponse;
}) {
  const { museum, staff, events, active_locations_count, upcoming_events } =
    data;

  return (
    <div className="space-y-6">
      {/* Museum status card */}
      <Card
        className={
          museum.subscription_expiring_soon
            ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
            : ""
        }
      >
        <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{museum.name}</p>
            <p className="text-xs text-muted-foreground">
              Тариф: {PLAN_LABELS[museum.subscription_plan] ?? museum.subscription_plan}
              {" · "}До {formatDatetime(museum.subscription_end_date)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MuseumStatusBadge status={museum.status} />
            {museum.subscription_expiring_soon && (
              <Badge variant="warning">Подписка скоро истекает</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Всего событий"
          value={events.total}
          icon={CalendarDays}
          accent="blue"
        />
        <StatCard
          label="Опубликовано"
          value={events.published}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Черновики"
          value={events.draft}
          icon={FileText}
        />
        <StatCard
          label="Площадки"
          value={active_locations_count}
          icon={MapPin}
          accent="blue"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Staff */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Сотрудники
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Администраторов</span>
                <span className="font-semibold">{staff.museum_admin}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сотрудников</span>
                <span className="font-semibold">{staff.museum_staff}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Events detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Статусы событий</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                { label: "Отменено", value: events.canceled, icon: XCircle, color: "text-rose-500" },
                { label: "В архиве", value: events.archived, icon: Clock, color: "text-muted-foreground" },
              ].map(({ label, value, icon: Icon, color }) => (
                <li key={label} className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-1.5 text-muted-foreground`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    {label}
                  </span>
                  <span className="font-semibold">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <UpcomingEvents events={upcoming_events} />
    </div>
  );
}

function MuseumStaffDashboard({ data }: { data: MuseumStaffDashboardResponse }) {
  const { museum, events, upcoming_events, subscription_warning } = data;

  return (
    <div className="space-y-6">
      {subscription_warning && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {subscription_warning}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{museum.name}</p>
            <p className="text-xs text-muted-foreground">
              Тариф: {PLAN_LABELS[museum.subscription_plan] ?? museum.subscription_plan}
            </p>
          </div>
          <MuseumStatusBadge status={museum.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Всего событий"
          value={events.total}
          icon={CalendarDays}
          accent="blue"
        />
        <StatCard
          label="Опубликовано"
          value={events.published}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard label="Черновики" value={events.draft} icon={FileText} />
      </div>

      <UpcomingEvents events={upcoming_events} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: dashboardQueryKeys.all,
    queryFn: dashboardApi.get,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Главная" />
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <PageHeader title="Главная" />
        <Card className="mt-6">
          <CardContent className="py-10 text-center text-muted-foreground">
            Не удалось загрузить данные дашборда
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Главная" description="Обзор системы" />
      <div className="mt-6">
        {data.role === "super_admin" && (
          <SuperAdminDashboard data={data as SuperAdminDashboardResponse} />
        )}
        {data.role === "museum_admin" && (
          <MuseumAdminDashboard data={data as MuseumAdminDashboardResponse} />
        )}
        {data.role === "museum_stuff" && (
          <MuseumStaffDashboard data={data as MuseumStaffDashboardResponse} />
        )}
      </div>
    </div>
  );
}
