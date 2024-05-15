import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { HostCountProvider } from "@/lan/hooks/host-count-provider";
import Hosts from "@/lan/page";
import { ThemeProvider } from "@/providers/theme-provider";
import Logs from "@/logs/page";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HostCountProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Hosts />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </Router>
      </HostCountProvider>
      <Toaster />
    </ThemeProvider>
  );
}
