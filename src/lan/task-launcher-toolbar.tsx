import TaskLauncherButton from "./task-launcher-button";
import { PortScanType } from "./types";
import useDetectOs from "./use-detect-os";
import useScanPorts from "./use-scan-ports";

export default function TaskLauncherToolbar({
  targetIps,
}: {
  targetIps: string[];
}) {
  const { isPending: osIsPending, error: osError, detectOs } = useDetectOs();
  const {
    isPending: portsIsPending,
    error: portsError,
    scanPorts,
  } = useScanPorts();

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
      <TaskLauncherButton
        title="Scan ports"
        onLaunch={(targetIps) => {
          scanPorts(targetIps, PortScanType.SYN);
        }}
        targetIps={targetIps}
        pending={portsIsPending}
        loadingText="Scanning ports..."
      />
    </div>
  );
}
