import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderCircle, Play, Square, TriangleAlert } from "lucide-react";
import { Module } from "./module-launcher-toolbar";

type ModuleLauncherButtonProps = {
  module: Module;
  onClick: () => void;
  moduleName: "Monitor" | "Probe";
  monitorIsRunning?: boolean;
};

export default function ModuleLauncherButton({
  module,
  onClick,
  moduleName,
  monitorIsRunning,
}: ModuleLauncherButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="sm"
            className="h-8"
            variant={module.isRunning ? "destructive" : "outline"}
            disabled={module.isPending}
          >
            {module.isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                {module.isRunning ? <p>Stopping...</p> : <p>Starting...</p>}
              </>
            ) : module.isRunning ? (
              <>
                <Square className="h-4 w-4" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <p>Stop {moduleName}</p>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <p>Start {moduleName}</p>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {moduleName === "Monitor" ? (
            <>
              <p className="mb-1 font-medium">Monitor module</p>
              <p>Passively discovers active hosts by </p>
              <p>sniffing ARP packets on the network.</p>
            </>
          ) : (
            <>
              <p className="mb-1 font-medium">Probe module</p>
              <p>Actively probes the network by periodically</p>
              <p>sending ARP requests to the entire subnet.</p>
              {module.isRunning && !monitorIsRunning ? (
                <div className="mt-1 flex items-center text-warning">
                  <TriangleAlert className="mr-1 h-4 w-4" />
                  <p>Start the Monitor module to begin discovering hosts.</p>
                </div>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Best used in combination with the Monitor module.
                </p>
              )}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
