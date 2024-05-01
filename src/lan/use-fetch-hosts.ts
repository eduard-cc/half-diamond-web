import { Host } from "./types";
import { useState, useEffect, useRef } from "react";

export default function useFetchHosts() {
  const [data, setData] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const createModule = (name: string) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return {
      isRunning,
      isLoading,
      start: async () => {
        setIsLoading(true);
        setTimeout(async () => {
          const response = await fetch(`http://localhost:8000/${name}/start`, {
            method: "POST",
          });
          const data = await response.json();
          setIsRunning(true);
          setIsLoading(false);
        }, 500);
      },
      stop: async () => {
        setIsLoading(true);
        setTimeout(async () => {
          const response = await fetch(`http://localhost:8000/${name}/stop`, {
            method: "POST",
          });
          const data = await response.json();
          setIsRunning(false);
          setIsLoading(false);
        }, 800);
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
    socketRef.current = socket;

    socket.onopen = () => {
      setLoading(false);
    };

    // Update data on WebSocket message
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

  return {
    data,
    loading,
    error,
    monitor,
    probe,
  };
}
