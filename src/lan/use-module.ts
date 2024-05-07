import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function useModule(name: "monitor" | "probe") {
  const [isRunning, setIsRunning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const start = (): Promise<void> => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await fetch(`http://localhost:8000/${name}/start`, {
            method: "POST",
          });
          if (!response.ok) {
            toast({
              variant: "destructive",
              title: `${capitalizeModule(name)} module failed to start.`,
            });
          }
          setIsRunning(true);
          toast({
            title: `${capitalizeModule(name)} module is now running.`,
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
      const response = await fetch(`http://localhost:8000/${name}/stop`, {
        method: "POST",
      });
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: `${capitalizeModule(name)} module failed to stop.`,
        });
      }
      setIsRunning(false);
      toast({
        title: `${capitalizeModule(name)} module has been stopped.`,
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

  const setRunning = (running: boolean) => {
    setIsRunning(running);
  };

  const capitalizeModule = (module: string) => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  return {
    isRunning,
    isPending,
    start,
    stop,
    setRunning,
  };
}
