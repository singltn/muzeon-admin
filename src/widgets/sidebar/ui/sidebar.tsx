"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Calendar,
  CalendarDays,
  MapPin,
  Settings,
  Tag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/shared/lib/rbac/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/museums",
    label: "Музеи",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    href: "/event-types",
    label: "Типы событий",
    icon: Tag,
    roles: ["super_admin"],
  },
  {
    href: "/museum",
    label: "Мой музей",
    icon: Building2,
    roles: ["museum_admin"],
  },
  {
    href: "/users",
    label: "Пользователи",
    icon: Users,
    roles: ["museum_admin"],
  },
  {
    href: "/events",
    label: "События",
    icon: CalendarDays,
    roles: ["museum_admin", "content", "marketer", "analyst"],
  },
  {
    href: "/locations",
    label: "Площадки",
    icon: MapPin,
    roles: ["museum_admin", "content", "marketer", "analyst"],
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    href: "/profile",
    label: "Профиль",
    icon: Settings,
    roles: ["super_admin", "museum_admin", "content", "marketer", "analyst"],
  },
  {
    href: "/sessions",
    label: "Сессии",
    icon: BarChart3,
    roles: ["super_admin", "museum_admin", "content", "marketer", "analyst"],
  },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const role = useAppSelector((s) => s.session.role);

  const visible = (item: NavItem) =>
    role ? item.roles.includes(role) : false;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-background transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0d2350] text-white">
          <Calendar className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide">MUZEON</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.filter(visible).map((item) =>
          renderLink(item, pathname, collapsed),
        )}
      </nav>

      <div className="border-t border-border p-2">
        {BOTTOM_ITEMS.filter(visible).map((item) =>
          renderLink(item, pathname, collapsed),
        )}
      </div>
    </aside>
  );
}

function renderLink(
  item: NavItem,
  pathname: string,
  collapsed: boolean,
) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <Link
      key={item.href}
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}
