import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./use-fetch-hosts";
import useModule from "./use-module";
import { Host, PortScanType } from "./types";
import useWebSocket from "./use-web-socket";
import { toast } from "@/components/ui/use-toast";
import useDetectOs from "./use-detect-os";
import useScanPorts from "./use-scan-ports";

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
      <DataTable
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
      </DataTable>
    </div>
  );
}
