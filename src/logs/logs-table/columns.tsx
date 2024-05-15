import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/lan/types";

export const columns = (): ColumnDef<Event>[] => [
  {
    accessorKey: "time",
    header: "Time",
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
