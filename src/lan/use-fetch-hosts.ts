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
    let socket: WebSocket | null = new WebSocket(
      "ws://localhost:8000/monitor/ws",
    );

    socket.onopen = () => {
      setIsPending(false);
    };

    socket.onmessage = (e) => {
      const event: Event = JSON.parse(e.data);
      if (event.type === EventType.HOST_NEW) {
        setData((prevData) => [...prevData, event.data]);
      } else {
        setData((prevData) => {
          return prevData.map((host) => {
            if (host.mac !== event.data.mac) {
              return host;
            }

            switch (event.type) {
              case EventType.HOST_SEEN:
                return updateHost(host, { last_seen: event.data.last_seen });
              case EventType.HOST_CONNECTED:
                return updateHost(host, {
                  status: event.data.status,
                  last_seen: event.data.last_seen,
                });
              case EventType.HOST_DISCONNECTED:
                return updateHost(host, { status: event.data.status });
              case EventType.SCAN_SYN:
              case EventType.SCAN_TCP:
              case EventType.SCAN_UDP:
                return updateHost(host, { open_ports: event.data.open_ports });
              case EventType.OS_DETECTED:
                return updateHost(host, { os: event.data.os });
              default:
                return host;
            }
          });
        });
      }
    };

    socket.onerror = (event) => {
      setError(new Error("WebSocket error: " + event));
      socket = null;
    };

    socket.onclose = () => {
      if (socket) {
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          socket = new WebSocket("ws://localhost:8000/monitor/ws");
        }, 5000);
      }
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const updateHost = (host: Host, updatedProperties: Partial<Host>) => {
    return {
      ...host,
      ...updatedProperties,
    };
  };

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
