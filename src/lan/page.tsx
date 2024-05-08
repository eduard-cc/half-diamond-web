import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./use-fetch-hosts";
import useModule from "./use-module";
import { Host } from "./types";
import useWebSocket from "./use-web-socket";
import { toast } from "@/components/ui/use-toast";

export default function Hosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const toastShown = useRef(false);

  const monitor = useModule("monitor");
  const probe = useModule("probe");
  const { isPending, error: fetchError } = useFetchHosts(setHosts);
  const { error: webSocketError } = useWebSocket(setHosts);

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
        columns={columns}
        data={hosts}
        isPending={isPending}
        error={fetchError || webSocketError}
        monitor={monitor}
      >
        <ModuleLauncherToolbar monitor={monitor} probe={probe} />
      </DataTable>
    </div>
  );
}
