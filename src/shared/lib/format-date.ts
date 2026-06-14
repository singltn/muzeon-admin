const RU_DATE = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const RU_DATETIME = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const RU_DATETIME_LONG = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return RU_DATE.format(d);
}

export function formatDatetime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(typeof value === "number" ? value * 1000 : value);
  if (isNaN(d.getTime())) return "—";
  return RU_DATETIME.format(d);
}

export function formatDatetimeLong(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(typeof value === "number" ? value * 1000 : value);
  if (isNaN(d.getTime())) return "—";
  return RU_DATETIME_LONG.format(d);
}

/** Преобразует ISO-строку в значение для datetime-local input */
export function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}
