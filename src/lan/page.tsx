import React from "react";
import { useEffect, useState } from "react";
import { columns } from "./hosts-table/columns";
import { HostsTable } from "./hosts-table/hosts-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./hooks/use-fetch-hosts";
import useModule from "./hooks/use-module";
import { Host, PortScanType } from "./types";
import useDetectOs from "./hooks/use-detect-os";
import useScanPorts from "./hooks/use-scan-ports";
import TaskLauncherToolbar from "./task-launcher-toolbar";
import { useHostCount } from "./hooks/use-host-count";

type HostsPageProps = {
  hosts: Host[];
  setHosts: React.Dispatch<React.SetStateAction<Host[]>>;
};

export default function HostsPage({ hosts, setHosts }: HostsPageProps) {
  const [scanType, setScanType] = useState<PortScanType>(PortScanType.SYN);
  const [selectedIps, setSelectedIps] = useState<string[]>([]);

  const monitor = useModule("monitor");
  const probe = useModule("probe");

  const { isPending: fetchIsPending, error: fetchError } =
    useFetchHosts(setHosts);
  const { isPending: osIsPending, detectOs } = useDetectOs();
  const { isPending: portsIsPending, scanPorts } = useScanPorts();
  const { setHostCount } = useHostCount();

  const hostsColumns = columns(
    detectOs,
    scanPorts,
    osIsPending,
    portsIsPending,
    scanType,
  );

  // Update online host count context when status changes
  useEffect(() => {
    const onlineHostCount = hosts.filter(
      (host) => host.status === "Online",
    ).length;

    setHostCount(onlineHostCount);
  }, [hosts]);

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
        <ModuleLauncherToolbar monitor={monitor} probe={probe} />
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
