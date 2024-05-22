import { useToast } from "@/components/ui/use-toast";
import { useState, useCallback } from "react";

export default function useDetectOs() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

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
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Something went wrong while detecting OS.",
        });
      }
      const os = await response.json();
      setData(os);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to establish connection to API.",
      });
    } finally {
      setIsPending(false);
    }
  }, []);

  return { isPending, data, detectOs };
}
