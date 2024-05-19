import { ColumnDef, Row } from "@tanstack/react-table";
import { Event, EventType, Host } from "@/lan/types";
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
import { getFormattedDate } from "@/lib/get-formatted-date";
import EventDescription from "./event-description";
import { cn } from "@/lib/utils";

type EventTypeStyle = {
  [EventType.HOST_SEEN]: string;
  [EventType.HOST_CONNECTED]: string;
  [EventType.HOST_DISCONNECTED]: string;
  [EventType.HOST_NEW]: string;
  [EventType.SCAN_SYN]: string;
  [EventType.SCAN_TCP]: string;
  [EventType.SCAN_UDP]: string;
  [EventType.OS_DETECTED]: string;
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
          className="-m-4"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateToLocaleString = new Date(row.original.time).toLocaleString();
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
          className="-m-4"
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
      const rowValue = (row.original[columnId as keyof Event] as Host).mac;
      return filterValue.includes(rowValue);
    },
    cell: ({ row }) => (
      <EventDescription eventType={row.original.type} host={row.original.data}>
        {" "}
        <span>
          <HostCard host={row.original.data}>
            <span className="font-medium text-primary underline-offset-4 hover:cursor-pointer hover:underline">
              {row.original.data.ip}
            </span>
          </HostCard>
          {row.original.data.name != "None" && (
            <>
              {" "}
              <Badge
                variant={
                  row.original.data.name === "Gateway" ? "secondary" : "outline"
                }
                className="px-1 py-0"
              >
                {row.original.data.name}
              </Badge>
            </>
          )}
        </span>
      </EventDescription>
    ),
  },
];
