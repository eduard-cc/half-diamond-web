import { ColumnDef } from "@tanstack/react-table";
import { Host, Port, PortScanType } from "@/lan/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import { getFormattedDate } from "@/lib/get-formatted-date";
import PortBadge from "@/components/port-badge";

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
    header: "IP",
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
    header: "Status",
    cell: ({ row }) => {
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
              last seen {getFormattedDate(row.original.last_seen)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
