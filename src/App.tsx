import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import HostsPage from "@/lan/page";
import { ThemeProvider } from "@/providers/theme-provider";
import useWebSocket from "@/lan/hooks/use-websocket";
import { HostsProvider, useHosts } from "@/providers/hosts-provider";
import { EventsProvider, useEvents } from "@/providers/events-provider";
import EventsPage from "@/logs/page";

export default function App() {
  const { hosts, setHosts } = useHosts();
  const { events, setEvents } = useEvents();
  useWebSocket(setHosts, setEvents);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HostsProvider>
        <EventsProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={<HostsPage hosts={hosts} setHosts={setHosts} />}
              />
              <Route
                path="/events"
                element={<EventsPage events={events} setEvents={setEvents} />}
              />
            </Routes>
          </Router>
        </EventsProvider>
      </HostsProvider>
      <Toaster />
    </ThemeProvider>
  );
}
