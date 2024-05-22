import React, { createContext, useState, useContext } from "react";
import type { Event } from "@/types/event";

type EventsProviderState = {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  newEventsCount: number;
  setNewEventsCount: React.Dispatch<React.SetStateAction<number>>;
};

type EventsProviderProps = {
  children: React.ReactNode;
};

const initialState: EventsProviderState = {
  events: [],
  setEvents: () => null,
  newEventsCount: 0,
  setNewEventsCount: () => null,
};

const EventsContext = createContext<EventsProviderState>(initialState);

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventsCount, setNewEventsCount] = useState<number>(0);

  return (
    <EventsContext.Provider
      value={{
        events,
        setEvents,
        newEventsCount,
        setNewEventsCount,
      }}
    >
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
