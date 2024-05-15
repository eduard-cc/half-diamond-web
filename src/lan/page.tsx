import { useEffect, useRef, useState } from "react";
import { columns } from "./hosts-table/columns";
import { HostsTable } from "./hosts-table/hosts-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./hooks/use-fetch-hosts";
import useModule from "./hooks/use-module";
import { Host, PortScanType } from "./types";
import useWebSocket from "./hooks/use-web-socket";
import { toast } from "@/components/ui/use-toast";
import useDetectOs from "./hooks/use-detect-os";
import useScanPorts from "./hooks/use-scan-ports";

export default function Hosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [scanType, setScanType] = useState<PortScanType>(PortScanType.SYN);

  const monitor = useModule("monitor");
  const probe = useModule("probe");

  const { isPending: fetchIsPending, error: fetchError } =
    useFetchHosts(setHosts);
  const { error: webSocketError } = useWebSocket(setHosts);
  const { isPending: osIsPending, detectOs } = useDetectOs();
  const { isPending: portsIsPending, scanPorts } = useScanPorts();

  const toastShown = useRef(false);
  const column = columns(
    detectOs,
    scanPorts,
    osIsPending,
    portsIsPending,
    scanType,
  );

  useEffect(() => {
    if ((fetchError || webSocketError) && !toastShown.current) {
      toast({
        variant: "destructive",
        title: "Failed to establish connection to API.",
      });
      toastShown.current = true;
    }
  }, [fetchError, webSocketError]);

  return (
    <div className="container mx-auto py-2">
      <HostsTable
        columns={column}
        data={hosts}
        fetchIsPending={fetchIsPending}
        error={fetchError || webSocketError}
        monitor={monitor}
        detectOs={detectOs}
        scanPorts={scanPorts}
        osIsPending={osIsPending}
        portsIsPending={portsIsPending}
        scanType={scanType}
        setScanType={setScanType}
      >
        <ModuleLauncherToolbar monitor={monitor} probe={probe} />
      </HostsTable>
    </div>
  );
}
