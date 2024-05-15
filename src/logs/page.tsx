import { columns } from "./logs-table/columns";
import { EventsTable } from "./logs-table/events-table";
import useFetchEvents from "./hooks/use-fetch-events";
import type { Event } from "@/lan/types";

type EventsPageProps = {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

export default function EventsPage({ events, setEvents }: EventsPageProps) {
  const { isPending: fetchIsPending, error: fetchError } =
    useFetchEvents(setEvents);

  return (
    <div className="container mx-auto py-2">
      <EventsTable
        columns={columns}
        data={events}
        isPending={fetchIsPending}
        error={fetchError}
      />
    </div>
  );
}
