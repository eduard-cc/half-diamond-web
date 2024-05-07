import { useState } from "react";
import { toast } from "sonner";

export default function useModule(name: "monitor" | "probe") {
  const [isRunning, setIsRunning] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const start = (): Promise<void> => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await fetch(`http://localhost:8000/${name}/start`, {
            method: "POST",
          });
          if (!response.ok) {
            toast.error(`${capitalizeModule(name)} module failed to start.`);
          }
          setIsRunning(true);
          toast.success(`${capitalizeModule(name)} module is now running.`);
          resolve();
        } catch (error) {
          toast.error("Failed to establish connection to API.");
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
        toast.error(`${capitalizeModule(name)} module failed to stop.`);
      }
      setIsRunning(false);
      toast.success(`${capitalizeModule(name)} module has been stopped.`);
    } catch (error) {
      toast.error(`${capitalizeModule(name)} module failed to stop.`, {
        description: "API is not responding.",
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
