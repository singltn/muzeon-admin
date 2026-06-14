"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Users, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { museumApi } from "@/entities/museum/api/museum-api";
import { museumQueryKeys } from "@/entities/museum/api/query-keys";
import { MuseumStatusBadge } from "@/shared/ui/status-badge";
import { MuseumProfileTab } from "./tabs/museum-profile-tab";
import { MuseumUsersTab } from "./tabs/museum-users-tab";
import { MuseumEventsTab } from "./tabs/museum-events-tab";
import { MuseumLocationsTab } from "./tabs/museum-locations-tab";
import { cn } from "@/shared/lib/utils";

const TABS = [
  { id: "profile", label: "Профиль", icon: Building2 },
  { id: "users", label: "Пользователи", icon: Users },
  { id: "locations", label: "Площадки", icon: MapPin },
  { id: "events", label: "События", icon: CalendarDays },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function MuseumDetailPage({ museumId }: { museumId: number }) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const { data: museum, isLoading } = useQuery({
    queryKey: museumQueryKeys.detail(museumId),
    queryFn: () => museumApi.byId(museumId),
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
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/museums"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Музеи
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{museum.name}</span>
        <MuseumStatusBadge status={museum.status} />
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "profile" && (
          <MuseumProfileTab museum={museum} isSuperAdmin />
        )}
        {activeTab === "users" && <MuseumUsersTab museumId={museumId} />}
        {activeTab === "locations" && (
          <MuseumLocationsTab museumId={museumId} canManage />
        )}
        {activeTab === "events" && (
          <MuseumEventsTab museumId={museumId} canManage />
        )}
      </div>
    </div>
  );
}
