import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format timestamp thành dạng "3 phút trước", "5 giờ trước"
 * @param timestamp ISO string hoặc Date
 */
export function formatRelativeTime(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  } catch {
    return "";
  }
}

/**
 * Format timestamp cho chat message
 * - Hôm nay: "14:30"
 * - Hôm qua: "Hôm qua 14:30"
 * - Khác: "20/11/2024 14:30"
 */
export function formatChatTimestamp(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

    if (isToday(date)) {
      return format(date, "HH:mm");
    }

    if (isYesterday(date)) {
      return `Hôm qua ${format(date, "HH:mm")}`;
    }

    return format(date, "dd/MM/yyyy HH:mm");
  } catch {
    return "";
  }
}

/**
 * Check xem timestamp có trong vòng X phút không
 */
export function isWithinMinutes(timestamp: string | Date, minutes: number): boolean {
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < minutes * 60 * 1000;
  } catch {
    return false;
  }
}
