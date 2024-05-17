import { EventType } from "@/lan/types";
import { columns } from "./events-table/columns";
import { EventsTable } from "./events-table/events-table";
import useFetchEvents from "./hooks/use-fetch-events";
import { useEvents } from "@/providers/events-provider";

export default function EventsPage() {
  const { events, setEvents } = useEvents();
  const { isPending: fetchIsPending, error: fetchError } =
    useFetchEvents(setEvents);

  return (
    <div className="container mx-auto py-2">
      <EventsTable
        columns={columns}
        data={events.filter((event) => event.type !== EventType.HOST_SEEN)}
        isPending={fetchIsPending}
        error={fetchError}
      />
    </div>
  );
}
