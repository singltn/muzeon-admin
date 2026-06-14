"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  MapPin,
  Settings,
  Tag,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { uiActions } from "@/store/slices/ui-slice";
import type { UserRole } from "@/shared/lib/rbac/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/museums",     label: "Музеи",        icon: Building2,  roles: ["super_admin"] },
  { href: "/event-types", label: "Типы событий", icon: Tag,        roles: ["super_admin"] },
  { href: "/museum",      label: "Мой музей",    icon: Building2,  roles: ["museum_admin"] },
  { href: "/users",       label: "Пользователи", icon: Users,      roles: ["museum_admin"] },
  { href: "/events",      label: "События",      icon: CalendarDays, roles: ["museum_admin", "content", "marketer", "analyst"] },
  { href: "/locations",   label: "Площадки",     icon: MapPin,     roles: ["museum_admin", "content", "marketer", "analyst"] },
];

const BOTTOM_ITEMS: NavItem[] = [
  { href: "/profile",  label: "Профиль", icon: Settings, roles: ["super_admin", "museum_admin", "content", "marketer", "analyst"] },
  { href: "/sessions", label: "Сессии",  icon: BarChart3, roles: ["super_admin", "museum_admin", "content", "marketer", "analyst"] },
];

type SidebarContentProps = {
  collapsed: boolean;
  onClose?: () => void;
};

function SidebarContent({ collapsed, onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const role = useAppSelector((s) => s.session.role);

  const visible = (item: NavItem) => (role ? item.roles.includes(role) : false);

  const linkCls = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      isActive
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      collapsed && !onClose && "justify-center px-2",
    );
  };

  return (
    <>
      <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex items-center">
          {(!collapsed || onClose) && (
            <span className="text-base font-bold tracking-widest text-[#0d2350] uppercase">
              Музеон
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.filter(visible).map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className={linkCls(item.href)} title={collapsed && !onClose ? item.label : undefined}>
            <item.icon className="h-4 w-4 shrink-0" />
            {(!collapsed || onClose) && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        {BOTTOM_ITEMS.filter(visible).map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className={linkCls(item.href)} title={collapsed && !onClose ? item.label : undefined}>
            <item.icon className="h-4 w-4 shrink-0" />
            {(!collapsed || onClose) && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </>
  );
}

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((s) => s.ui.sidebarMobileOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-background transition-all duration-200 lg:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => dispatch(uiActions.setMobileSidebarOpen(false))}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          collapsed={false}
          onClose={() => dispatch(uiActions.setMobileSidebarOpen(false))}
        />
      </aside>
    </>
  );
}
