import { useEffect } from "react";
import type { Event } from "@/types/event";
import type { Host } from "@/types/host";
import { EventType } from "@/types/event-type";
import { toast } from "@/components/ui/use-toast";

export default function useWebSocket(
  updateHosts: (updateFn: (prevData: Host[]) => Host[]) => void,
  updateEvents: (updateFn: (prevData: Event[]) => Event[]) => void,
  setNewEventsCount: (updateFn: (prevData: number) => number) => void,
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
      updateEvents((prevEvents) => [event, ...prevEvents]);
      if (
        event.type !== EventType.HOST_SEEN &&
        window.location.pathname !== "/events"
      ) {
        setNewEventsCount((prevCount) => prevCount + 1);
      }

      if (event.type === EventType.HOST_NEW) {
        updateHosts((prevData) => [...prevData, ...event.data]);
      } else {
        updateHosts((prevData) => {
          return prevData.map((host) => {
            const matchingHost = event.data.find(
              (h: Host) => h.mac === host.mac,
            );

            if (!matchingHost) {
              return host;
            }

            switch (event.type) {
              case EventType.HOST_SEEN:
                return mergeProps(host, {
                  last_seen: matchingHost.last_seen,
                });
              case EventType.HOST_CONNECTED:
                return mergeProps(host, {
                  status: matchingHost.status,
                  last_seen: matchingHost.last_seen,
                });
              case EventType.HOST_DISCONNECTED:
                return mergeProps(host, { status: matchingHost.status });
              case EventType.SCAN_SYN:
              case EventType.SCAN_TCP:
              case EventType.SCAN_UDP:
                return mergeProps(host, {
                  open_ports: matchingHost.open_ports,
                });
              case EventType.OS_DETECTED:
                return mergeProps(host, { os: matchingHost.os });
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
