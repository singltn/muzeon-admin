import { Badge } from "@/shared/ui/badge";
import type { ContentStatus } from "@/entities/content/model/types";

const statusConfig: Record<
  ContentStatus,
  { label: string; variant: "secondary" | "default" | "success" | "warning" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  published: { label: "Опубликовано", variant: "default" },
  active: { label: "Активен", variant: "success" },
  archived: { label: "Архив", variant: "warning" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
