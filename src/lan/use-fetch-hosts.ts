import { Host } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function useFetchHosts() {
  const [data, setData] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createModule = (name: string) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return {
      isRunning,
      isLoading,
      start: () => {
        setIsLoading(true);
        setTimeout(async () => {
          try {
            const response = await fetch(
              `http://localhost:8000/${name}/start`,
              {
                method: "POST",
              },
            );
            if (!response.ok) {
              toast.error(`${capitalizeModule(name)} module failed to start.`);
            }
            setIsRunning(true);
            toast.success(`${capitalizeModule(name)} module is now running.`);
          } catch (error) {
            toast.error(`${capitalizeModule(name)} module failed to start.`, {
              description: "API is not responding.",
            });
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      },
      stop: async () => {
        setIsLoading(true);
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
          setIsLoading(false);
        }
      },
      setRunning: (running: boolean) => {
        setIsRunning(running);
      },
    };
  };

  const monitor = createModule("monitor");
  const probe = createModule("probe");

  useEffect(() => {
    const fetchHosts = async () => {
      const monitorResponse = await fetch(
        "http://localhost:8000/monitor/status",
      );
      const probeResponse = await fetch("http://localhost:8000/probe/status");
      const monitorStatus = await monitorResponse.json();
      const probeStatus = await probeResponse.json();

      monitor.setRunning(monitorStatus.running);
      probe.setRunning(probeStatus.running);

      const response = await fetch("http://localhost:8000/monitor/hosts");
      let hosts: Host[] = await response.json();

      if (!monitorStatus.running) {
        hosts = hosts.map((host) => {
          host.status = "Offline";
          return host;
        });
      }
      setData(hosts);
    };

    fetchHosts();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/monitor/ws");

    socket.onopen = () => {
      setLoading(false);
    };

    socket.onmessage = (event) => {
      const hosts: Host[] = JSON.parse(event.data);
      setData(hosts);
    };

    socket.onerror = (event) => {
      setError(new Error("WebSocket error: " + event));
    };

    return () => socket.close();
  }, []);

  // Set all hosts to offline when monitor is stopped
  useEffect(() => {
    if (!monitor.isRunning) {
      const offlineHosts = data.map((host) => {
        host.status = "Offline";
        return host;
      });
      setData(offlineHosts);
    }
  }, [monitor.isRunning]);

  const capitalizeModule = (module: string) => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  return {
    data,
    loading,
    error,
    monitor,
    probe,
  };
}
