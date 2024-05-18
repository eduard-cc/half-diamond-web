import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { CircleAlert, X } from "lucide-react";
import { EventsTableFacetedFilter } from "./events-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Event } from "@/lan/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HostsFacetedFilter } from "./hosts-faceted-filter";

type EventsTableProps<TData extends Event, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending: boolean;
  error: Error | null;
};

export function EventsTable<TData extends Event, TValue>({
  columns,
  data,
  isPending,
  error,
}: EventsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const options = useMemo(() => {
    return Array.from(
      new Set(
        data.map((event) =>
          JSON.stringify({ mac: event.data.mac, ip: event.data.ip }),
        ),
      ),
    ).map((option) => JSON.parse(option));
  }, [data]);

  return (
    <>
      <div className="mb-2 flex gap-2">
        <EventsTableFacetedFilter
          column={table.getColumn("type")}
          title="Type"
        />
        <HostsFacetedFilter
          column={table.getColumn("data")}
          title="Host IP"
          hosts={options}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <ScrollArea
          className={
            table.getRowModel().rows?.length > 10 ? "h-[40rem]" : "h-auto"
          }
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 border-b bg-background">
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
                    No events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
}
