"use client";

import { PageHeader } from "@/shared/ui/page-header";
import { useAppSelector } from "@/store/hooks";
import { getUserDisplayName } from "@/entities/user/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  museum_admin: "Администратор музея",
  content: "Контент-менеджер",
  marketer: "Маркетолог",
  analyst: "Аналитик",
};

export function ProfilePage() {
  const user = useAppSelector((s) => s.session.user);

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Профиль" />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{getUserDisplayName(user)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Email" value={user.email} />
          <Field label="Имя" value={user.first_name} />
          <Field label="Фамилия" value={user.last_name} />
          <Field label="Роль" value={ROLE_LABELS[user.role] ?? user.role} />
          {user.museum && (
            <Field label="Музей" value={user.museum.name} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
