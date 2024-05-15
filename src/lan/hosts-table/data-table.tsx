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
import { Host, PortScanType } from "../types";
import { useHostCount } from "../hooks/use-host-count";
import TaskLauncherToolbar from "../task-launcher-toolbar";
import { DataTableColumnToggle } from "./data-table-column-toggle";
import DataTablePaginationButtons from "./data-table-pagination-buttons";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Module } from "../hooks/use-module";

type DataTableProps<TData extends Host, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchIsPending: boolean;
  error: Error | null;
  children: React.ReactNode;
  monitor: Module;
  detectOs: (targetIps: string[]) => void;
  scanPorts: (targetIps: string[], scanType: PortScanType) => void;
  osIsPending: boolean;
  portsIsPending: boolean;
  scanType: PortScanType;
  setScanType: React.Dispatch<React.SetStateAction<PortScanType>>;
};

export function DataTable<TData extends Host, TValue>({
  columns,
  data,
  fetchIsPending,
  error,
  children,
  monitor,
  detectOs,
  scanPorts,
  osIsPending,
  portsIsPending,
  scanType,
  setScanType,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const { setHostCount } = useHostCount();
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

  // Update online host count context when status changes
  useEffect(() => {
    const rows = table.getFilteredRowModel().rows as Row<Host>[];
    const onlineHostCount = rows.filter(
      (row) => row.original.status === "Online",
    ).length;
    setHostCount(onlineHostCount);
  }, [data]);

  const getTargetIps = () => {
    const rows = table.getFilteredSelectedRowModel().rows as Row<Host>[];
    return rows.map((row) => row.original.ip);
  };

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
        <div className="flex gap-2">
          {children}
          <TaskLauncherToolbar
            targetIps={getTargetIps()}
            detectOs={detectOs}
            scanPorts={scanPorts}
            osIsPending={osIsPending}
            portsIsPending={portsIsPending}
            scanType={scanType}
            setScanType={setScanType}
          />
        </div>
        <DataTableColumnToggle table={table} />
      </div>
      <div className="rounded-md border">
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
                  className="h-24 text-center font-semibold"
                >
                  <div className="flex items-center justify-center text-destructive">
                    <p>
                      <CircleAlert className="mr-1 h-4 w-4" />
                    </p>
                    <span>Failed to establish connection to API.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : fetchIsPending ? (
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
