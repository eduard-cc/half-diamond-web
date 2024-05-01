import { useState, useCallback } from "react";

export default function useScanPorts() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scanPorts = useCallback(async (targetIps: string[]) => {
    setLoading(true);
    setError(null);
    try {
      console.log("about to scan ports");
      const response = await fetch("http://localhost:8000/ports", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(targetIps),
      });
      console.log("finished scanning ports");
      // Don't need the data since we're polling for it anyway
      const openPorts = await response.json();
      setData(openPorts);
    } catch (error) {
      console.error(error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, scanPorts };
}
