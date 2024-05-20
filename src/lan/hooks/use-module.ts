import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export type Module = {
  isRunning: boolean;
  isPending: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

export default function useModule(module: "monitor" | "probe" | "arp-spoof") {
  const [isRunning, setIsRunning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/${module}/status`);
        const status = await response.json();
        setIsRunning(status.running);
      } catch (error) {
        toast({
          variant: "destructive",
          title: `Failed to fetch ${capitalizeModule(module)} module status.`,
        });
      }
    };

    fetchStatus();
  }, []);

  const start = (): Promise<void> => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/${module}/start`,
            {
              method: "POST",
            },
          );
          if (!response.ok) {
            toast({
              variant: "destructive",
              title: `${capitalizeModule(module)} module failed to start.`,
            });
          }
          setIsRunning(true);
          toast({
            title: `${capitalizeModule(module)} module is now running.`,
          });
          resolve();
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to establish connection to API.",
          });
          reject(error);
        } finally {
          setIsPending(false);
        }
      }, 500);
    });
  };

  const stop = async () => {
    setIsPending(true);
    try {
      const response = await fetch(`http://localhost:8000/${module}/stop`, {
        method: "POST",
      });
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: `${capitalizeModule(module)} module failed to stop.`,
        });
      }
      setIsRunning(false);
      toast({
        title: `${capitalizeModule(module)} module has been stopped.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to establish connection to API.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const capitalizeModule = (module: string) => {
    if (module === "arp-spoof") {
      return "ARP Spoof";
    }
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  return {
    isRunning,
    isPending,
    start,
    stop,
  };
}
