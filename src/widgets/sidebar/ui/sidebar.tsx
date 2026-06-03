"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Image,
  LayoutGrid,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PermissionGate } from "@/features/rbac/permission-gate/ui/permission-gate";
import type { Permission } from "@/shared/lib/rbac/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
};

const navItems: NavItem[] = [
  { href: "/", label: "Обзор", icon: Home },
  {
    href: "/exhibitions",
    label: "События",
    icon: LayoutGrid,
    permission: "exhibitions:read",
  },
  {
    href: "/artifacts",
    label: "Медиа",
    icon: Image,
    permission: "artifacts:read",
  },
  {
    href: "/users",
    label: "Пользователи",
    icon: Users,
    permission: "users:read",
  },
];

const bottomItems: NavItem[] = [
  { href: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-background transition-all",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Ticket className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Muzeon</p>
            <p className="truncate text-xs text-muted-foreground">Админ-панель</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => renderNavLink(item, pathname, collapsed))}
      </nav>

      <nav className="border-t border-border p-2">
        {bottomItems.map((item) => renderNavLink(item, pathname, collapsed))}
      </nav>
    </aside>
  );
}

function renderNavLink(
  item: NavItem,
  pathname: string,
  collapsed: boolean,
) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  const link = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (!item.permission) return <div key={item.href}>{link}</div>;

  return (
    <PermissionGate key={item.href} permission={item.permission}>
      {link}
    </PermissionGate>
  );
}
