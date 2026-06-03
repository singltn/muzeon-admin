import type { ContentStatus, ContentType } from "@/entities/content/model/types";

export type ExhibitionStatus = ContentStatus;

export type Exhibition = {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ExhibitionStatus;
  startsAt: string;
  endsAt: string;
  ticketsSold?: number;
  revenueRub?: number;
  updatedAt: string;
};
