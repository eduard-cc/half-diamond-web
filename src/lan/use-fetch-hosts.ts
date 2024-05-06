import { EventType, Host, Event } from "./types";
import { useState, useEffect } from "react";
import useModule from "./use-module";

export default function useFetchHosts() {
  const [data, setData] = useState<Host[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const monitor = useModule("monitor");
  const probe = useModule("probe");

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
      setIsPending(false);
    };

    socket.onmessage = (e) => {
      console.log(e.data);
      const event: Event = JSON.parse(e.data);
      console.log(event.data);
      console.log(event.type);
      if (event.type === EventType.HOST_NEW) {
        setData((prevData) => [...prevData, event.data]);
      } else if (
        event.type === EventType.HOST_SEEN ||
        event.type === EventType.HOST_CONNECTED ||
        event.type === EventType.HOST_DISCONNECTED
      ) {
        setData((prevData) => {
          return prevData.map((host) => {
            if (host.mac === event.data.mac) {
              return event.data;
            } else {
              return host;
            }
          });
        });
      }
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
    isPending,
    error,
    monitor,
    probe,
  };
}
