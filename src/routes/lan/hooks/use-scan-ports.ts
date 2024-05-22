import { useState, useCallback } from "react";
import { PortScanType } from "@/types/port-scan-type";
import { useToast } from "@/components/ui/use-toast";

export default function useScanPorts() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const scanPorts = useCallback(
    async (targetIps: string[], scanType: PortScanType) => {
      setIsPending(true);
      try {
        const response = await fetch(
          `http://localhost:8000/ports?type=${scanType}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(targetIps),
          },
        );
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Something went wrong while scanning ports.",
          });
        }
        const openPorts = await response.json();
        setData(openPorts);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to establish connection to API.",
        });
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { isPending, data, scanPorts };
}
