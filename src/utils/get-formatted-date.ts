import { formatDistanceToNow } from "date-fns";

export function getFormattedDate(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true,
  });
}
