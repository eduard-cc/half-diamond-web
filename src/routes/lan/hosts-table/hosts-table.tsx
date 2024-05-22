import {
  ColumnDef,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { Host } from "@/types/host";
import { DataTableColumnToggle } from "./data-table-column-toggle";
import DataTablePaginationButtons from "./data-table-pagination-buttons";
import { Button } from "@/components/ui/button";
import type { Module } from "@/routes/lan/hooks/use-module";

type HostsTableProps<TData extends Host, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending: boolean;
  error: Error | null;
  children: React.ReactNode;
  monitor: Module;
  setSelectedIps: (ips: string[]) => void;
};

export function HostsTable<TData extends Host, TValue>({
  columns,
  data,
  isPending,
  error,
  children,
  monitor,
  setSelectedIps,
}: HostsTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const savedVisibility = window.sessionStorage.getItem("columnVisibility");
      return savedVisibility ? JSON.parse(savedVisibility) : {};
    },
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnVisibility: columnVisibility,
    },
  });

  // Update selected IPs when row selection changes
  useEffect(() => {
    const rows = table.getFilteredSelectedRowModel().rows as Row<Host>[];
    const ips = rows.map((row) => row.original.ip);
    setSelectedIps(ips);
  }, [rowSelection]);

  // Save the user's column visibility preferences in session storage
  useEffect(() => {
    window.sessionStorage.setItem(
      "columnVisibility",
      JSON.stringify(columnVisibility),
    );
  }, [columnVisibility]);

  return (
    <>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2">{children}</div>
        <DataTableColumnToggle table={table} />
      </div>
      <div className="relative w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-medium text-destructive"
                >
                  <span>Failed to establish connection to API.</span>
                </TableCell>
              </TableRow>
            ) : isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="max-w-64">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hosts found.
                  {!monitor.isRunning && (
                    <p>
                      <Button
                        variant="link"
                        onClick={async () => await monitor.start()}
                      >
                        Start the Monitor module to begin discovering hosts
                      </Button>
                    </p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePaginationButtons table={table} />
    </>
  );
}
