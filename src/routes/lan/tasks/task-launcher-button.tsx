import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { LoaderCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TaskLauncherButtonProps = {
  title: "Detect OS" | "Scan Ports";
  onLaunch: (targetIps: string[]) => void;
  targetIps: string[];
  pending: boolean;
  loadingText: string;
};

export default function TaskLauncherButton({
  title,
  onLaunch,
  targetIps,
  pending,
  loadingText,
}: TaskLauncherButtonProps) {
  const handleClick = () => {
    onLaunch(targetIps);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={targetIps.length === 0 || pending}
              onClick={handleClick}
              className={cn(
                "flex w-full items-center justify-between border-transparent md:h-8 md:justify-start md:border-input",
                title === "Scan Ports" && "rounded-l-none",
              )}
            >
              {pending ? (
                <>
                  {loadingText}
                  <LoaderCircle className="ml-1 h-4 w-4 animate-spin" />
                </>
              ) : (
                title
              )}
              {targetIps.length > 0 && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 hidden h-4 md:flex"
                  />
                  <div className="flex space-x-1 md:hidden">
                    <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                      {targetIps.length}
                    </Badge>
                  </div>
                  <div className="hidden space-x-1 md:flex">
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
            {title === "Detect OS" ? (
              <>
                <p>Detects the operating system of selected hosts</p>
                <p>using TCP/IP stack fingerprinting.</p>
              </>
            ) : (
              <>
                <p>Enumerates open ports of selected hosts</p>
                <p>using TCP/IP based service discovery.</p>
              </>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
