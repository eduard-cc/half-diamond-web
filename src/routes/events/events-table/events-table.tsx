import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
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
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { EventType } from "@/types/event-type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FacetedFilter } from "./faceted-filter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { eventTypeStyle } from "./columns";

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
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const hostsOptions = useMemo(() => {
    const uniqueHosts = new Map(
      data.map((event) => {
        const key = `${event.data.mac}-${event.data.ip}`;
        return [key, { mac: event.data.mac, ip: event.data.ip }];
      }),
    );

    return Array.from(uniqueHosts.values())
      .sort((a, b) => {
        const ipA = a.ip.split(".").map(Number);
        const ipB = b.ip.split(".").map(Number);

        for (let i = 0; i < ipA.length; i++) {
          if (ipA[i] < ipB[i]) {
            return -1;
          }
          if (ipA[i] > ipB[i]) {
            return 1;
          }
        }

        return 0;
      })
      .map(({ mac, ip }) => ({
        label: ip,
        value: mac,
        component: ({ label }: { label: string }) => <span>{label}</span>,
      }));
  }, [data]);

  const EventTypeBadge = ({ label }: { label: string }) => (
    <Badge
      className={cn(
        eventTypeStyle[label] || eventTypeStyle.default,
        "hover:bg-[sameColor]",
      )}
    >
      {label}
    </Badge>
  );

  const eventTypeOptions = useMemo(() => {
    return Object.entries(EventType)
      .filter(([key]) => key !== EventType.HOST_SEEN)
      .map(([_, value]) => ({
        label: value,
        value: value,
        component: EventTypeBadge,
      }));
  }, []);

  const eventGroups = [
    {
      title: "Host events",
      group: [
        EventType.HOST_NEW,
        EventType.HOST_CONNECTED,
        EventType.HOST_DISCONNECTED,
      ],
    },
    {
      title: "Scan events",
      group: [EventType.SCAN_SYN, EventType.SCAN_TCP, EventType.SCAN_UDP],
    },
    {
      title: "OS events",
      group: [EventType.OS_DETECTED],
    },
  ];

  return (
    <>
      <div className="mb-2 flex gap-2">
        <FacetedFilter
          column={table.getColumn("type")}
          title="Type"
          options={eventTypeOptions}
          headers={eventGroups}
        />
        <FacetedFilter
          column={table.getColumn("data")}
          title="Host IP"
          options={hostsOptions}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Clear all filters
            <FilterX className="ml-2 h-4 w-4" />
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
                      <TableCell key={cell.id} className="p-3">
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
