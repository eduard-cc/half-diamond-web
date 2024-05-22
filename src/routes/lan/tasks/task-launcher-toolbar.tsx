import TaskLauncherButton from "./task-launcher-button";
import PortScanTypeDropdown from "./port-scan-type-dropdown";
import { PortScanType } from "@/types/port-scan-type";

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
    <div className="flex gap-2">
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
  );
}
