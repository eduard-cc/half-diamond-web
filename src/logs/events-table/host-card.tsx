import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Host } from "@/lan/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getFormattedDate } from "@/lib/get-formatted-date";
import CopyToClipboardButton from "@/components/copy-to-clipboard-button";
import PortBadge from "@/components/port-badge";

type HostCardProps = {
  host: Host;
  children: React.ReactNode;
};

export function HostCard({ host, children }: HostCardProps) {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between">
          {host.name && host.name != "None" && (
            <p className="font-medium">{host.name}</p>
          )}
          <Badge
            variant="outline"
            className={`${
              host.status === "Online"
                ? "border-green-600/20 bg-green-50 text-green-900 dark:border-green-50/20 dark:bg-green-800/50 dark:text-green-50"
                : "bg-gray-50 text-gray-700 dark:border-gray-200/20 dark:bg-gray-600/50 dark:text-foreground"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`mr-2 inline-block h-2 w-2 rounded-full ${
                  host.status === "Online"
                    ? "animate-pulse bg-green-600 dark:bg-green-300"
                    : "bg-gray-400"
                }`}
              ></span>
              <span>{host.status}</span>
            </div>
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-muted-foreground">IP</div>
            <CopyToClipboardButton text={host.ip} />
          </div>
          <div>
            <div className="text-muted-foreground">MAC</div>
            <CopyToClipboardButton text={host.mac.toLocaleUpperCase()} />
          </div>
          <div>
            <div className="text-muted-foreground">OS</div>
            <div>{host.os ? host.os : "Unknown"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Vendor</div>
            <div>{host.vendor}</div>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">
          last seen {getFormattedDate(host.last_seen)}
        </p>
        {host.open_ports && host.open_ports?.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="mb-2 text-muted-foreground">Open Ports</div>
              <div className="flex flex-wrap gap-2">
                {host.open_ports.map((port) => (
                  <PortBadge key={port.port} port={port} />
                ))}
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
