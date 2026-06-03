import type { ContentType } from "@/entities/content/model/types";

const typeLabels: Record<ContentType, string> = {
  exhibition: "Выставка",
  lecture: "Лекция",
  workshop: "Мастер-класс",
  event: "Событие",
  excursion: "Экскурсия",
};

export function ContentTypeLabel({ type }: { type: ContentType }) {
  return <span className="text-sm text-foreground">{typeLabels[type]}</span>;
}
