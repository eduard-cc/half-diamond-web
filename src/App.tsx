import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { HostCountProvider } from "@/lan/hooks/host-count-provider";
import Hosts from "@/lan/page";
import { ThemeProvider } from "./providers/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HostCountProvider>
        <Navbar />
        <Hosts />
      </HostCountProvider>
      <Toaster />
    </ThemeProvider>
  );
}
