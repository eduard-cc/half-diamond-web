import { ColumnDef } from "@tanstack/react-table";
import { Host, Port } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Circle,
  CircleDashed,
  Info,
  Lightbulb,
  Package,
  Wrench,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const columns: ColumnDef<Host>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const onlineRows = table
        .getRowModel()
        .rows.filter((row) => row.original.status === "Online");
      const isAllOnlineRowsSelected = onlineRows.every((row) =>
        row.getIsSelected(),
      );
      const isSomeOnlineRowsSelected = onlineRows.some((row) =>
        row.getIsSelected(),
      );

      return (
        <Checkbox
          checked={
            isAllOnlineRowsSelected ||
            (isSomeOnlineRowsSelected && "indeterminate")
          }
          onCheckedChange={(value: boolean) => {
            onlineRows.forEach((row) => row.toggleSelected(value));
          }}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      if (row.original.status !== "Online") {
        return null;
      }

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
      if (row.original.name === "None") {
        return row.original.ip;
      }
      return (
        <>
          {row.original.ip}
          <Badge
            variant={row.original.name === "Gateway" ? "secondary" : "outline"}
            className="ml-2"
          >
            {row.original.name}
          </Badge>
        </>
      );
    },
  },
  {
    accessorKey: "mac",
    header: "MAC",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      if (row.getValue("vendor") === "Unknown") {
        return (
          <p className="text-muted-foreground">{row.getValue("vendor")}</p>
        );
      } else {
        return <div>{row.getValue("vendor")}</div>;
      }
    },
  },
  {
    accessorKey: "os",
    header: "OS",
    cell: ({ row }) => {
      if (row.getValue("os") === null || row.getValue("os") === "Unknown") {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-sm text-muted-foreground"
                >
                  Unknown
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detect OS</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return <div>{row.getValue("os")}</div>;
      }
    },
  },
  {
    accessorKey: "open_ports",
    header: "Open ports",
    cell: ({ row }) => {
      const openPorts = row.getValue("open_ports") as Port[];
      if (!openPorts || openPorts.length === 0) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-sm text-muted-foreground"
                >
                  {!openPorts ? "Unknown" : "None"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!openPorts ? "Scan ports" : "Scan ports again"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return openPorts.map((port) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge key={port.port} className="mr-1">
                  {port.port}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="grid">
                  <div className="inline">
                    {port.state === "open" ? (
                      <Circle className="mr-1 inline h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CircleDashed className="mr-1 h-4 w-4 text-muted-foreground" />
                    )}
                    {port.port}/{port.protocol}
                  </div>
                  {port.name && (
                    <div className="inline">
                      <Wrench className="mr-1 inline h-4 w-4 text-muted-foreground" />
                      {port.name}
                    </div>
                  )}
                  {port.product && (
                    <div className="inline">
                      <Package className="mr-1 inline h-4 w-4 text-muted-foreground" />
                      {port.product} {port.version ? `(${port.version})` : ""}
                    </div>
                  )}
                  {port.extrainfo && (
                    <div className="inline">
                      <Info className="mr-1 inline h-4 w-4 text-muted-foreground" />
                      {port.extrainfo}
                    </div>
                  )}
                  {port.reason && (
                    <div className="inline uppercase">
                      <Lightbulb className="mr-1 inline h-4 w-4 text-muted-foreground" />
                      {port.reason}
                    </div>
                  )}
                </div>
                <Progress value={Number(port.conf) * 10} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ));
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const date = new Date(row.original.last_seen);
      let formattedDate = "Invalid date";

      if (date.getTime() <= Date.now()) {
        const differenceInSeconds = (Date.now() - date.getTime()) / 1000;
        if (row.original.status === "Online" && differenceInSeconds <= 30) {
          formattedDate = "now";
        } else {
          formattedDate = formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: true,
          });
        }
      }
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className={`${
                  row.original.status === "Online"
                    ? "border-green-600/20 bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${
                      row.original.status === "Online"
                        ? "animate-pulse bg-green-600"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span>{row.original.status}</span>
                </div>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>last seen {formattedDate}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
