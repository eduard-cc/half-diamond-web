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
import { Host } from "./types";
import { useHostCount } from "./use-host-count";
import TaskLauncherToolbar from "./task-launcher-toolbar";
import { DataTableColumnToggle } from "./data-table-column-toggle";
import DataTablePaginationButtons from "./data-table-pagination-buttons";

type DataTableProps<TData extends Host, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData extends Host, TValue>({
  columns,
  data,
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

  // Listen when a host disconnects and deselect it
  useEffect(() => {
    const rows = table.getSelectedRowModel().rows as Row<Host>[];
    rows.forEach((row) => {
      if (row.getIsSelected() && row.original.status !== "Online") {
        row.toggleSelected(false);
      }
    });
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
      <TaskLauncherToolbar targetIps={getTargetIps()} />
      <DataTableColumnToggle table={table} />
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
            {table.getRowModel().rows?.length ? (
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
