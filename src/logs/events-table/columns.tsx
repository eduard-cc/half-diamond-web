import { ColumnDef, Row } from "@tanstack/react-table";
import { Event, EventType } from "@/lan/types";
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

export const eventTypeStyle = {
  [EventType.HOST_SEEN]: "bg-blue-500 text-white",
  [EventType.HOST_CONNECTED]: "bg-green-500 text-white",
  [EventType.HOST_DISCONNECTED]:
    "bg-gray-50 text-gray-700 dark:border-gray-200/20 dark:bg-gray-600/50 dark:text-foreground",
  [EventType.HOST_NEW]: "bg-yellow-500 text-white",
  [EventType.SCAN_TCP]: "bg-purple-500 text-white",
  [EventType.SCAN_SYN]: "bg-red-500 text-white",
  [EventType.SCAN_UDP]: "bg-orange-500 text-white",
  [EventType.OS_DETECTED]: "bg-teal-500 text-white",
  default: "bg-gray-500 text-white",
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
        <Badge className={badgeStyle} variant="outline">
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) => <HostCard host={row.original.data} />,
  },
];
