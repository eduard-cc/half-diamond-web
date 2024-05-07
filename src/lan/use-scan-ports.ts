import { useState, useCallback } from "react";
import { PortScanType } from "./types";
import { toast } from "sonner";

export default function useScanPorts() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const scanPorts = useCallback(
    async (targetIps: string[], scanType: PortScanType) => {
      setIsPending(true);
      try {
        const response = await fetch(
          `http://localhost:8000/ports?scan_type=${scanType}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(targetIps),
          },
        );
        const openPorts = await response.json();
        setData(openPorts);
      } catch (error) {
        toast.error("Something went wrong while scanning ports.");
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { isPending, data, scanPorts };
}
