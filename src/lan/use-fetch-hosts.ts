import { Host } from "./types";
import { useState, useEffect, useRef } from "react";

export default function useFetchHosts() {
  const [data, setData] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isFirstLoad = useRef(true);
  const socketRef = useRef<WebSocket | null>(null);
  const dataRef = useRef<Host[]>([]);

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
    const fetchModuleStatus = async () => {
      console.log("fetching status?");
      const monitorResponse = await fetch(
        "http://localhost:8000/monitor/status",
      );
      const probeResponse = await fetch("http://localhost:8000/probe/status");

      const monitorStatus = await monitorResponse.json();
      const probeStatus = await probeResponse.json();

      console.log(monitorStatus);
      console.log(probeStatus);

      monitor.setRunning(monitorStatus.running);
      probe.setRunning(probeStatus.running);
    };

    const fetchHosts = async () => {
      console.log("fetching hosts?");
      const response = await fetch("http://localhost:8000/monitor/hosts");
      let hosts: Host[] = await response.json();
      if (!monitor.isRunning) {
        hosts = hosts.map((host) => {
          host.status = "Offline";
          return host;
        });
      }
      setData(hosts);
    };

    fetchHosts();
    fetchModuleStatus();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/monitor/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      setLoading(false);
      isFirstLoad.current = false;
    };

    let timeoutId: number | null = null;

    // Update data on WebSocket message
    socket.onmessage = (event) => {
      console.log(event.data);
      // console.log(monitor.isRunning);
      // if (!monitor.isRunning) {
      //   return;
      // }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        const newData = JSON.parse(event.data) as Host[];
        const isDataDifferent = newData.some((newHost) => {
          const currentHost = dataRef.current.find(
            (host) => host.ip === newHost.ip,
          );
          if (!currentHost) {
            return true;
          }
          // Calculate the difference in seconds between the last seen times
          const newLastSeen = new Date(newHost.last_seen).getTime();
          const currentLastSeen = new Date(currentHost.last_seen).getTime();
          const differenceInSeconds =
            Math.abs(newLastSeen - currentLastSeen) / 1000;
          return differenceInSeconds >= 2;
        });
        if (isDataDifferent) {
          setData(newData);
          dataRef.current = newData;
        }
      }, 500);
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
