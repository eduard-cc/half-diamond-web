import { useState, useCallback } from "react";
import { PortScanType } from "./types";

export default function useScanPorts() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scanPorts = useCallback(
    async (targetIps: string[], scanType: PortScanType) => {
      setIsPending(true);
      setError(null);
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
        console.log(openPorts);
        setData(openPorts);
      } catch (error) {
        console.error(error);
        setError(error as Error);
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { isPending, error, data, scanPorts };
}
