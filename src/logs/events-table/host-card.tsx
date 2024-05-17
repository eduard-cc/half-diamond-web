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
        {host.name && host.name != "None" && (
          <p className="mb-4 font-medium">{host.name}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
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
