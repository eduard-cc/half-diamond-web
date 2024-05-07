import { useState, useCallback } from "react";

export default function useDetectOs() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const detectOs = useCallback(async (targetIps: string[]) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/os", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(targetIps),
      });
      // Don't need the data since we're polling for it anyway
      const osData = await response.json();
      setData(osData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { isPending, error, data, detectOs };
}
