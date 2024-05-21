import { useState } from "react";
import { columns } from "./hosts-table/columns";
import { HostsTable } from "./hosts-table/hosts-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./hooks/use-fetch-hosts";
import useModule from "./hooks/use-module";
import { PortScanType } from "./types";
import useDetectOs from "./hooks/use-detect-os";
import useScanPorts from "./hooks/use-scan-ports";
import TaskLauncherToolbar from "./task-launcher-toolbar";
import { useHosts } from "@/providers/hosts-provider";

export default function HostsPage() {
  const { hosts, setHosts } = useHosts();
  const [scanType, setScanType] = useState<PortScanType>(PortScanType.SYN);
  const [selectedIps, setSelectedIps] = useState<string[]>([]);

  const monitor = useModule("monitor");
  const probe = useModule("probe");
  const arpSpoof = useModule("arp-spoof");

  const { isPending: fetchIsPending, error: fetchError } =
    useFetchHosts(setHosts);
  const { isPending: osIsPending, detectOs } = useDetectOs();
  const { isPending: portsIsPending, scanPorts } = useScanPorts();

  const hostsColumns = columns(
    detectOs,
    scanPorts,
    osIsPending,
    portsIsPending,
    scanType,
  );

  return (
    <div className="container mx-auto py-2">
      <HostsTable
        columns={hostsColumns}
        data={hosts}
        isPending={fetchIsPending}
        error={fetchError}
        monitor={monitor}
        setSelectedIps={setSelectedIps}
      >
        <ModuleLauncherToolbar
          monitor={monitor}
          probe={probe}
          arpSpoof={arpSpoof}
          targetIps={selectedIps}
        />
        <TaskLauncherToolbar
          targetIps={selectedIps}
          detectOs={detectOs}
          scanPorts={scanPorts}
          osIsPending={osIsPending}
          portsIsPending={portsIsPending}
          scanType={scanType}
          setScanType={setScanType}
        />
      </HostsTable>
    </div>
  );
}
