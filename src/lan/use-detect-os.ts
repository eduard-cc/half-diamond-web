import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function useDetectOs() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const detectOs = useCallback(async (targetIps: string[]) => {
    setIsPending(true);
    try {
      const response = await fetch("http://localhost:8000/os", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(targetIps),
      });
      const os = await response.json();
      setData(os);
    } catch (error) {
      toast.error("Something went wrong while detecting OS.");
    } finally {
      setIsPending(false);
    }
  }, []);

  return { isPending, data, detectOs };
}
