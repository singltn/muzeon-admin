export type Session = {
  session_id: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  is_mobile: boolean;
  created_at: number; // unix timestamp (seconds)
  is_current?: boolean;
};
