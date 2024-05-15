import { useEffect } from "react";
import { EventType, Event, Host } from "@/lan/types";
import { toast } from "@/components/ui/use-toast";

export default function useWebSocket(
  updateHosts: (updateFn: (prevData: Host[]) => Host[]) => void,
  updateEvents: (updateFn: (prevData: Event[]) => Event[]) => void,
) {
  const mergeProps = (host: Host, updatedProperties: Partial<Host>) => {
    return {
      ...host,
      ...updatedProperties,
    };
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/events/ws");

    socket.onmessage = (e) => {
      const event: Event = JSON.parse(e.data);
      updateEvents((prevEvents) => [...prevEvents, event]);

      if (event.type === EventType.HOST_NEW) {
        updateHosts((prevData) => [...prevData, event.data]);
      } else {
        updateHosts((prevData) => {
          return prevData.map((host) => {
            if (host.mac !== event.data.mac) {
              return host;
            }

            switch (event.type) {
              case EventType.HOST_SEEN:
                return mergeProps(host, {
                  last_seen: event.data.last_seen,
                });
              case EventType.HOST_CONNECTED:
                return mergeProps(host, {
                  status: event.data.status,
                  last_seen: event.data.last_seen,
                });
              case EventType.HOST_DISCONNECTED:
                return mergeProps(host, { status: event.data.status });
              case EventType.SCAN_SYN:
              case EventType.SCAN_TCP:
              case EventType.SCAN_UDP:
                return mergeProps(host, {
                  open_ports: event.data.open_ports,
                });
              case EventType.OS_DETECTED:
                return mergeProps(host, { os: event.data.os });
              default:
                return host;
            }
          });
        });
      }
    };

    socket.onerror = () => {
      toast({
        variant: "destructive",
        title: "Failed to establish connection to API.",
      });
    };

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);
}
