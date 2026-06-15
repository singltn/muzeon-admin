import type { MuseumStatus } from "@/entities/museum/model/types";
import type { EventStatus } from "@/entities/event/model/types";

export type SubscriptionPlan = "free" | "basic" | "premium";

// ----- Sub-types -----

export type StatusCountItem = {
  status: MuseumStatus;
  count: number;
};

export type PlanCountItem = {
  plan: SubscriptionPlan;
  count: number;
};

export type MuseumsSummary = {
  total: number;
  by_status: StatusCountItem[];
};

export type SubscriptionsSummary = {
  by_plan: PlanCountItem[];
};

export type ExpiringMuseumItem = {
  id: number;
  name: string;
  subscription_plan: SubscriptionPlan;
  subscription_end_date: string;
};

export type ProblemMuseumItem = {
  id: number;
  name: string;
  status: MuseumStatus;
};

export type TopMuseumByEventsItem = {
  id: number;
  name: string;
  events_count: number;
};

export type MuseumCardSummary = {
  id: number;
  name: string;
  status: MuseumStatus;
  subscription_plan: SubscriptionPlan;
  subscription_end_date: string;
  subscription_expiring_soon: boolean;
};

export type StaffSummary = {
  museum_admin: number;
  museum_staff: number;
};

export type EventsSummaryFull = {
  total: number;
  published: number;
  draft: number;
  canceled: number;
  archived: number;
};

export type EventsSummaryStaff = {
  total: number;
  published: number;
  draft: number;
};

export type UpcomingEventItem = {
  id: number;
  title: string;
  date_start: string;
  status: EventStatus;
  capacity: number;
  occupied: number | null;
  can_edit: boolean;
};

// ----- Dashboard responses -----

export type SuperAdminDashboardResponse = {
  role: "super_admin";
  museums: MuseumsSummary;
  subscriptions: SubscriptionsSummary;
  expiring_subscriptions: ExpiringMuseumItem[];
  problem_museums: ProblemMuseumItem[];
  top_museums_by_events: TopMuseumByEventsItem[];
};

export type MuseumAdminDashboardResponse = {
  role: "museum_admin";
  museum: MuseumCardSummary;
  staff: StaffSummary;
  events: EventsSummaryFull;
  active_locations_count: number;
  upcoming_events: UpcomingEventItem[];
};

export type MuseumStaffDashboardResponse = {
  role: "museum_stuff";
  museum: MuseumCardSummary;
  events: EventsSummaryStaff;
  upcoming_events: UpcomingEventItem[];
  subscription_warning: string | null;
};

export type DashboardResponse =
  | SuperAdminDashboardResponse
  | MuseumAdminDashboardResponse
  | MuseumStaffDashboardResponse;
