import {
  ColumnDef,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import type { Host } from "@/types/host";
import { DataTableColumnToggle } from "./data-table-column-toggle";
import DataTablePaginationButtons from "./data-table-pagination-buttons";
import { Button } from "@/components/ui/button";
import type { Module } from "@/routes/lan/hooks/use-module";
import { FacetedFilter } from "@/routes/events/events-table/faceted-filter";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const savedVisibility = window.sessionStorage.getItem("columnVisibility");
      return savedVisibility ? JSON.parse(savedVisibility) : {};
    },
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnVisibility: columnVisibility,
      sorting,
      columnFilters,
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

  const hostsOptions = useMemo(() => {
    return data
      .map((host) => ({
        label: host.ip,
        value: host.ip,
        component: ({ label }: { label: string }) => <span>{label}</span>,
      }))
      .sort((a, b) => {
        const subnetA = Number(a.label.split(".").pop());
        const subnetB = Number(b.label.split(".").pop());
        return subnetA - subnetB;
      });
  }, [data]);

  return (
    <>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2">{children}</div>
        <div className="flex gap-2">
          <FacetedFilter
            column={table.getColumn("ip")}
            title="IP"
            options={hostsOptions}
            align="center"
          />
          <DataTableColumnToggle table={table} />
        </div>
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
                    <TableCell key={cell.id}>
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
