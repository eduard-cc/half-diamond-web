import TaskLauncherButton from "./task-launcher-button";
import useDetectOs from "./use-detect-os";
import useScanPorts from "./use-scan-ports";
import PortScanTypeDropdown from "./port-scan-type-dropdown";
import { useState } from "react";
import { PortScanType } from "./types";

export default function TaskLauncherToolbar({
  targetIps,
}: {
  targetIps: string[];
}) {
  const { isPending: osIsPending, detectOs } = useDetectOs();
  const { isPending: portsIsPending, scanPorts } = useScanPorts();
  const [scanType, setScanType] = useState<PortScanType>(PortScanType.SYN);

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
