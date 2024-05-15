import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/lan/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.original.time);
      const formattedDate = formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
      });
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>{date.toLocaleString()}</TooltipTrigger>
            <TooltipContent>{formattedDate}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "data",
    header: "Data",
  },
];
