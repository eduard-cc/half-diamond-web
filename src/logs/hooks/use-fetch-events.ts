import { useEffect, useState } from "react";
import type { Event } from "@/lan/types";

export default function useFetchEvents(setEvents: (events: Event[]) => void) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsPending(true);
      try {
        const response = await fetch("http://localhost:8000/events");
        const events = await response.json();
        setEvents(events);
      } catch (error) {
        setError(new Error());
      } finally {
        setIsPending(false);
      }
    };

    fetchEvents();
  }, []);

  return {
    isPending,
    error,
  };
}
