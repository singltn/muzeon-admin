import { Badge } from "@/shared/ui/badge";
import type { EventStatus } from "@/entities/event/model/types";
import type { MuseumStatus } from "@/entities/museum/model/types";

const eventStatusConfig: Record<
  EventStatus,
  { label: string; variant: "secondary" | "default" | "success" | "warning" | "destructive" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  published: { label: "Опубликовано", variant: "success" },
  archived: { label: "Архив", variant: "warning" },
  canceled: { label: "Отменено", variant: "destructive" },
};

const museumStatusConfig: Record<
  MuseumStatus,
  { label: string; variant: "secondary" | "default" | "success" | "warning" | "destructive" }
> = {
  trial: { label: "Пробный", variant: "default" },
  active: { label: "Активен", variant: "success" },
  inactive: { label: "Неактивен", variant: "secondary" },
  blocked: { label: "Заблокирован", variant: "destructive" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const cfg = eventStatusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function MuseumStatusBadge({ status }: { status: MuseumStatus }) {
  const cfg = museumStatusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

/** Бейдж активности пользователя */
export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {isActive ? "Активен" : "Неактивен"}
    </Badge>
  );
}
