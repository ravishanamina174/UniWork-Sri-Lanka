const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, "");

export function websocketUrl(path: string): string {
  const websocketProtocol = API_BASE_URL.startsWith("https://") ? "wss://" : "ws://";
  const host = API_BASE_URL.replace(/^https?:\/\//, "");
  return `${websocketProtocol}${host}${path.startsWith("/") ? path : `/${path}`}`;
}