import React, { createContext, useState, useContext } from "react";
import type { Event } from "@/lan/types";

type EventsProviderState = {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

type EventsProviderProps = {
  children: React.ReactNode;
};

const initialState: EventsProviderState = {
  events: [],
  setEvents: () => null,
};

const EventsContext = createContext<EventsProviderState>(initialState);

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = (): EventsProviderState => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};
