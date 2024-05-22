import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Port } from "@/types/port";

export default function PortBadge({ port }: { port: Port }) {
  return (
    <TooltipProvider key={port.port}>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary">{port.port}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="grid">
            <div className="inline">
              {port.port}/{port.protocol}
            </div>
            {port.name && (
              <div className="inline text-muted-foreground">{port.name}</div>
            )}
            {port.product && (
              <div className="inline text-muted-foreground">
                {port.product} {port.version ? `(${port.version})` : ""}
              </div>
            )}
            {port.extrainfo && (
              <div className="inline text-muted-foreground">
                {port.extrainfo}
              </div>
            )}
            {port.reason && (
              <div className="inline uppercase text-muted-foreground">
                {port.reason}
              </div>
            )}
            {port.conf && (
              <div className="inline text-muted-foreground">
                {port.conf}/10 conf
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
