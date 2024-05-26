import TaskLauncherButton from "./task-launcher-button";
import PortScanTypeDropdown from "./port-scan-type-dropdown";
import { PortScanType } from "@/types/port-scan-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type TaskLauncherToolbarProps = {
  targetIps: string[];
  detectOs: (targetIps: string[]) => void;
  scanPorts: (targetIps: string[], scanType: PortScanType) => void;
  osIsPending: boolean;
  portsIsPending: boolean;
  scanType: PortScanType;
  setScanType: React.Dispatch<React.SetStateAction<PortScanType>>;
};

export default function TaskLauncherToolbar({
  targetIps,
  detectOs,
  scanPorts,
  osIsPending,
  portsIsPending,
  scanType,
  setScanType,
}: TaskLauncherToolbarProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex xl:hidden">
          <Button variant="outline" size="sm" className="h-8">
            Scanners
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem asChild>
              <TaskLauncherButton
                title="Detect OS"
                onLaunch={(targetIps) => {
                  detectOs(targetIps);
                }}
                targetIps={targetIps}
                pending={osIsPending}
                loadingText="Detecting OS..."
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <TaskLauncherButton
                title="Scan Ports"
                onLaunch={(targetIps) => {
                  scanPorts(targetIps, scanType);
                }}
                targetIps={targetIps}
                pending={portsIsPending}
                loadingText="Scanning ports..."
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <PortScanTypeDropdown
                disabled={portsIsPending}
                scanType={scanType}
                setScanType={setScanType}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="hidden gap-2 xl:flex">
        <TaskLauncherButton
          title="Detect OS"
          onLaunch={(targetIps) => {
            detectOs(targetIps);
          }}
          targetIps={targetIps}
          pending={osIsPending}
          loadingText="Detecting OS..."
        />
        <div className="flex">
          <PortScanTypeDropdown
            disabled={portsIsPending}
            scanType={scanType}
            setScanType={setScanType}
          />
          <TaskLauncherButton
            title="Scan Ports"
            onLaunch={(targetIps) => {
              scanPorts(targetIps, scanType);
            }}
            targetIps={targetIps}
            pending={portsIsPending}
            loadingText="Scanning ports..."
          />
        </div>
      </div>
    </>
  );
}
