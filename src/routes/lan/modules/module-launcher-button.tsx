import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderCircle, Play, Square } from "lucide-react";
import { Module } from "@/routes/lan/hooks/use-module";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";

type ModuleLauncherButtonProps = {
  module: Module;
  onClick?: (event: React.MouseEvent) => void;
  moduleName: "Monitor" | "Probe" | "ARP Spoof";
  monitorIsRunning?: boolean;
  targetIps?: string[];
};

export default function ModuleLauncherButton({
  module,
  onClick,
  moduleName,
  monitorIsRunning,
  targetIps = [],
}: ModuleLauncherButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="sm"
            className="flex w-full items-center justify-start border-transparent 2xl:h-8 2xl:border-input"
            variant={module.isRunning ? "destructive" : "outline"}
            disabled={module.isPending}
          >
            {module.isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <Separator
                  orientation="vertical"
                  className={cn(
                    "mx-2 h-4",
                    module.isRunning && "dark:bg-foreground",
                  )}
                />
                {module.isRunning ? <p>Stopping...</p> : <p>Starting...</p>}
              </>
            ) : module.isRunning ? (
              <>
                <Square className="h-4 w-4" />
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4 dark:bg-foreground"
                />
                <p>{moduleName}</p>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <p>{moduleName}</p>
              </>
            )}
            {moduleName === "ARP Spoof" &&
              targetIps.length > 0 &&
              !module.isRunning && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 hidden h-4 2xl:flex"
                  />
                  <div className="flex space-x-1 2xl:hidden">
                    <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                      {targetIps.length}
                    </Badge>
                  </div>
                  <div className="hidden space-x-1 2xl:flex">
                    {targetIps.length > 1 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {targetIps.length} selected
                      </Badge>
                    ) : (
                      targetIps.map((targetIp) => (
                        <Badge
                          variant="secondary"
                          key={targetIp}
                          className="rounded-sm px-1 font-normal"
                        >
                          {targetIp}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-80">
          {moduleName === "Monitor" ? (
            <>
              <p className="mb-1 font-medium">Monitor module</p>
              <p>Passively discovers active hosts by </p>
              <p>sniffing ARP packets on the network.</p>
            </>
          ) : moduleName === "Probe" ? (
            <>
              <p className="mb-1 font-medium">Probe module</p>
              <p>Actively probes the network by periodically</p>
              <p>sending ARP requests to the entire subnet.</p>
              {module.isRunning && !monitorIsRunning ? (
                <p className="mt-1 font-medium text-destructive">
                  Start the Monitor module to begin discovering hosts.
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Monitor module must be running to sniff hosts.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mb-1 font-medium">ARP Spoof module</p>
              <p>Performs a MITM attack that intercepts traffic</p>
              <p>of selected hosts using spoofed ARP packets.</p>
              {module.arpSpoofedIps.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Current target{module.arpSpoofedIps.length > 1 && "s"}
                  </p>
                  <div className="my-1 flex flex-wrap gap-1">
                    {module.arpSpoofedIps.map((ip) => (
                      <Badge
                        variant="destructive"
                        className="px-1 py-0"
                        key={ip}
                      >
                        {ip}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
