import { ColumnDef, Row } from "@tanstack/react-table";
import { EventType } from "@/types/event-type";
import type { Event } from "@/types/event";
import type { Host } from "@/types/host";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HostCard } from "./host-card";
import { getFormattedDate } from "@/utils/get-formatted-date";
import EventDescription from "./event-description";
import { cn } from "@/utils/cn";

type EventTypeStyle = {
  [EventType.HOST_SEEN]: string;
  [EventType.HOST_CONNECTED]: string;
  [EventType.HOST_DISCONNECTED]: string;
  [EventType.HOST_NEW]: string;
  [EventType.SCAN_SYN]: string;
  [EventType.SCAN_TCP]: string;
  [EventType.SCAN_UDP]: string;
  [EventType.OS_DETECTED]: string;
  [EventType.ARP_SPOOF_STARTED]: string;
  [EventType.ARP_SPOOF_STOPPED]: string;
  default: string;
  [key: string]: string;
};

export const eventTypeStyle: EventTypeStyle = {
  [EventType.HOST_SEEN]:
    "bg-stone-200/40 text-stone-950 dark:text-stone-50 dark:bg-stone-600/40 border-stone-900/20 dark:border-stone-50/10",
  [EventType.HOST_CONNECTED]:
    "bg-green-200/40 text-green-950 dark:text-green-50 dark:bg-green-600/40 border-green-900/20 dark:border-green-50/10",
  [EventType.HOST_DISCONNECTED]:
    "bg-stone-200/40 text-stone-950 dark:text-stone-50 dark:bg-stone-600/40 border-stone-900/20 dark:border-stone-50/10",
  [EventType.HOST_NEW]:
    "bg-yellow-200/40 text-yellow-950 dark:text-yellow-50 dark:bg-yellow-600/40 border-yellow-900/20 dark:border-yellow-50/10",
  [EventType.SCAN_SYN]:
    "bg-cyan-200/40 text-cyan-950 dark:text-cyan-50 dark:bg-cyan-600/40 border-cyan-900/20 dark:border-cyan-50/10",
  [EventType.SCAN_TCP]:
    "bg-blue-200/40 text-blue-950 dark:text-blue-50 dark:bg-blue-600/40 border-blue-900/20 dark:border-blue-50/10",
  [EventType.SCAN_UDP]:
    "bg-violet-200/40 text-violet-950 dark:text-violet-50 dark:bg-violet-600/40 border-violet-900/20 dark:border-violet-50/10",
  [EventType.OS_DETECTED]:
    "bg-fuchsia-200/40 text-fuchsia-950 dark:text-fuchsia-50 dark:bg-fuchsia-600/40 border-fuchsia-900/20 dark:border-fuchsia-50/10",
  [EventType.ARP_SPOOF_STARTED]:
    "bg-red-200/40 text-red-950 dark:text-red-50 dark:bg-red-600/40 border-red-900/20 dark:border-red-50/10",
  [EventType.ARP_SPOOF_STOPPED]:
    "bg-pink-200/40 text-pink-950 dark:text-pink-50 dark:bg-pink-600/40 border-pink-900/20 dark:border-pink-50/10",
  default:
    "bg-stone-200/40 text-stone-950 dark:text-stone-50 dark:bg-stone-600/40 border-stone-900/20 dark:border-stone-50/10",
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-m-5"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.time);
      const dateToLocaleString = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`;
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-1 w-fit">{dateToLocaleString}</p>
            </TooltipTrigger>
            <TooltipContent>
              {getFormattedDate(row.original.time)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-m-5"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row: Row<Event>, columnId: string, filterValue: any[]) => {
      const rowValue = row.original[columnId as keyof Event];
      return filterValue.includes(rowValue);
    },
    cell: ({ row }) => {
      const badgeStyle =
        eventTypeStyle[row.original.type] || eventTypeStyle.default;
      return (
        <Badge variant="outline" className={cn(badgeStyle, "")}>
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "data",
    header: "Description",
    filterFn: (row: Row<Event>, columnId: string, filterValue: any[]) => {
      const rowValue = row.original[columnId as keyof Event] as Host[];
      return rowValue.some((host) => filterValue.includes(host.mac));
    },
    cell: ({ row }) => (
      <EventDescription
        eventType={row.getValue("type")}
        hosts={row.getValue("data")}
      >
        {row.original.data.map((host, index) => (
          <span key={host.ip}>
            <HostCard host={host}>
              <span className="font-medium text-primary underline-offset-4 hover:cursor-pointer hover:underline">
                {host.ip}
              </span>
            </HostCard>
            {host.name && (
              <>
                {" "}
                <Badge
                  variant={host.name === "Gateway" ? "secondary" : "outline"}
                  className="px-1 py-0"
                >
                  {host.name}
                </Badge>
              </>
            )}
            {index < row.original.data.length - 1 && ", "}
          </span>
        ))}
      </EventDescription>
    ),
  },
];
