import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/lan/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      const date = new Date(row.original.time);
      const formattedDate = formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
      });
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-1 w-fit">{date.toLocaleString()}</p>
            </TooltipTrigger>
            <TooltipContent>{formattedDate}</TooltipContent>
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
    cell: ({ row }) => {
      let badgeStyle = "";
      switch (row.original.type) {
        case "host.seen":
          badgeStyle = "bg-blue-500 text-white";
          break;
        case "host.connected":
          badgeStyle = "bg-green-500 text-white";
          break;
        case "host.disconnected":
          badgeStyle =
            "bg-gray-50 text-gray-700 dark:border-gray-200/20 dark:bg-gray-600/50 dark:text-foreground";
          break;
        case "host.new":
          badgeStyle = "bg-yellow-500 text-white";
          break;
        default:
          badgeStyle = "bg-gray-500 text-white";
      }
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
  },
];
