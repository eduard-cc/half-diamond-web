import { ColumnDef, Row } from "@tanstack/react-table";
import type { Port } from "@/types/port";
import type { Host } from "@/types/host";
import { PortScanType } from "@/types/port-scan-type";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import CopyToClipboardButton from "@/components/shared/copy-to-clipboard-button";
import { getFormattedDate } from "@/utils/get-formatted-date";
import PortBadge from "@/components/shared/port-badge";
import { ArrowUpDown } from "lucide-react";

export const columns = (
  detectOs: (targetIps: string[]) => void,
  scanPorts: (targetIps: string[], scanType: PortScanType) => void,
  osIsPending: boolean,
  portsIsPending: boolean,
  scanType: PortScanType,
  arpSpoofedIps: string[],
): ColumnDef<Host>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-m-4"
        >
          IP
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isSpoofed = arpSpoofedIps.includes(row.original.ip);
      return (
        <>
          <CopyToClipboardButton text={row.original.ip} />
          {row.original.name && (
            <Badge
              variant={
                row.original.name === "Gateway" ? "secondary" : "outline"
              }
              className="ml-2"
            >
              {row.original.name}
            </Badge>
          )}
          {isSpoofed && (
            <Badge variant="destructive" className="ml-2">
              ARP Spoofed
            </Badge>
          )}
        </>
      );
    },
    sortingFn: (rowA, rowB, isAsc) => {
      const lastPartOfIpA = parseInt(rowA.original.ip.split(".").pop() || "0");
      const lastPartOfIpB = parseInt(rowB.original.ip.split(".").pop() || "0");

      if (lastPartOfIpA < lastPartOfIpB) {
        return isAsc ? -1 : 1;
      }
      if (lastPartOfIpA > lastPartOfIpB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    },
    filterFn: (row: Row<Host>, columnId: string, filterValue: any[]) => {
      if (columnId === "ip") {
        const rowValue = row.original[columnId];
        return filterValue.map(String).includes(String(rowValue).toLowerCase());
      }
      return false;
    },
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => {
      return (
        <CopyToClipboardButton text={row.original.mac.toLocaleUpperCase()} />
      );
    },
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("vendor") === "Unknown" ? (
            <p className="text-muted-foreground">{row.getValue("vendor")}</p>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-1 w-fit">{row.getValue("vendor")}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.getValue("vendor")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "os",
    header: "OS",
    cell: ({ row }) => {
      if (row.getValue("os") === null || row.getValue("os") === "Unknown") {
        return (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-sm text-muted-foreground"
                  onClick={() => detectOs([row.original.ip])}
                  disabled={osIsPending}
                >
                  Unknown
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {osIsPending ? "Detecting OS..." : "Detect OS"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="line-clamp-1 w-fit">{row.getValue("os")}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.getValue("os")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
  },
  {
    accessorKey: "open_ports",
    header: "Open ports",
    cell: ({ row }) => {
      const openPorts = row.getValue("open_ports") as Port[];
      return !openPorts || openPorts.length === 0 ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="link"
                size="sm"
                className="p-0 text-sm text-muted-foreground"
                onClick={() => scanPorts([row.original.ip], scanType)}
                disabled={portsIsPending}
              >
                {!openPorts ? "Unknown" : "None"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {portsIsPending ? "Scanning ports..." : "Scan ports"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex flex-wrap gap-1">
          {openPorts.map((port) => (
            <PortBadge key={port.port} port={port} />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-m-4"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isLocalHost = row.original.name && row.original.name != "Gateway";
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className={`${
                  row.original.status === "Online"
                    ? "border-green-900/20 bg-green-200/40 text-green-950 dark:border-green-50/10 dark:bg-green-600/40 dark:text-green-50"
                    : "border-stone-900/20 bg-stone-200/40 text-stone-950 dark:border-stone-50/10 dark:bg-stone-600/40 dark:text-stone-50"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${
                      row.original.status === "Online"
                        ? "animate-pulse bg-green-600 dark:bg-green-300"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span>{row.original.status}</span>
                </div>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              last seen{" "}
              {isLocalHost ? "now" : getFormattedDate(row.original.last_seen)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
