import { useState, useCallback } from "react";
import { PortScanType } from "./types";

export default function useScanPorts() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scanPorts = useCallback(
    async (targetIps: string[], scanType: PortScanType) => {
      setLoading(true);
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
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, data, scanPorts };
}
