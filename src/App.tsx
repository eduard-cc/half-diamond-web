import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import HostsPage from "@/routes/lan/page";
import { ThemeProvider } from "@/providers/theme-provider";
import { HostsProvider } from "@/providers/hosts-provider";
import { EventsProvider } from "@/providers/events-provider";
import EventsPage from "@/routes/events/page";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HostsProvider>
        <EventsProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HostsPage />} />
              <Route path="/events" element={<EventsPage />} />
            </Routes>
          </Router>
        </EventsProvider>
      </HostsProvider>
      <Toaster />
    </ThemeProvider>
  );
}
