import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { LoaderCircle } from "lucide-react";

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
    <Button
      variant="outline"
      size="sm"
      disabled={targetIps.length === 0 || pending}
      onClick={handleClick}
      className={cn("h-8", title === "Scan Ports" && "rounded-l-none")}
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
          <Separator orientation="vertical" className="mx-2 h-4" />
          {targetIps.map((targetIp) => (
            <Badge
              key={targetIp}
              className="rounded-sm px-1 font-normal lg:hidden"
              variant="secondary"
            >
              {targetIps}
            </Badge>
          ))}
          <div className="hidden space-x-1 lg:flex">
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
  );
}
