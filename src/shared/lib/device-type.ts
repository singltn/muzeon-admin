export type DeviceType = "mobile" | "tablet" | "desktop" | "bot";

export function detectDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/bot|crawler|spider|scraper/i.test(ua)) return "bot";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Краткое название браузера и ОС из UA */
export function parseUserAgent(ua: string): string {
  if (!ua) return "Неизвестное устройство";

  let browser = "Браузер";
  let os = "";

  if (/Chrome\//.test(ua) && !/Chromium|Edg\/|OPR\//.test(ua)) browser = "Chrome";
  else if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";

  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) os = "macOS";
  else if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Linux/.test(ua)) os = "Linux";

  return os ? `${browser} · ${os}` : browser;
}
