import TaskLauncherButton from "./task-launcher-button";
import useDetectOs from "./use-detect-os";
import useScanPorts from "./use-scan-ports";

export default function TaskLauncherToolbar({
  targetIps,
}: {
  targetIps: string[];
}) {
  const { loading: osLoading, error: osError, detectOs } = useDetectOs();
  const {
    loading: portsLoading,
    error: portsError,
    scanPorts,
  } = useScanPorts();

  return (
    <div className="mb-2 flex gap-2">
      <TaskLauncherButton
        title="Detect OS"
        onLaunch={(targetIps) => {
          detectOs(targetIps);
        }}
        targetIps={targetIps}
        loading={osLoading}
        loadingText="Detecting OS..."
      />
      <TaskLauncherButton
        title="Scan ports"
        onLaunch={(targetIps) => {
          scanPorts(targetIps);
        }}
        targetIps={targetIps}
        loading={portsLoading}
        loadingText="Scanning ports..."
      />
    </div>
  );
}
