export type MuseumStatus = "trial" | "active" | "inactive" | "blocked";
export type SubscriptionPlan = "free" | "basic" | "premium";

export type Museum = {
  id: number;
  name: string;
  legal_name: string;
  inn: string;
  ogrn: string;
  email: string;
  phone: string;
  address: string;
  status: MuseumStatus;
  subscription_plan: SubscriptionPlan;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type MuseumCreate = {
  name: string;
  legal_name: string;
  inn: string;
  ogrn: string;
  email: string;
  phone: string;
  address: string;
};

export type MuseumUpdate = Partial<MuseumCreate> & {
  status?: MuseumStatus;
  subscription_plan?: SubscriptionPlan;
  subscription_end_date?: string | null;
};

export const MUSEUM_STATUS_LABELS: Record<MuseumStatus, string> = {
  trial: "Пробный",
  active: "Активен",
  inactive: "Неактивен",
  blocked: "Заблокирован",
};

export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: "Free",
  basic: "Basic",
  premium: "Premium",
};
