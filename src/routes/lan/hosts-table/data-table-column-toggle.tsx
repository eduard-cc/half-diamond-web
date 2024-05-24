import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

type DataTableColumnToggleProps<TData> = {
  table: Table<TData>;
};

export function DataTableColumnToggle<TData>({
  table,
}: DataTableColumnToggleProps<TData>) {
  const columnNames = {
    ip: "IP",
    mac: "MAC",
    vendor: "Vendor",
    os: "OS",
    open_ports: "Open ports",
    status: "Status",
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8" size="sm">
          <ListFilter className="mr-2 h-4 w-4" />
          Toggle columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {table
          .getAllColumns()
          .filter(
            (column) =>
              column.getCanHide() &&
              column.id !== "select" &&
              column.id !== "ip",
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnNames[column.id as keyof typeof columnNames] ||
                  column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
