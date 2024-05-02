import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { HostCountProvider } from "@/lan/host-count-provider";
import Hosts from "@/lan/page";
import { ThemeProvider } from "./theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HostCountProvider>
        <Navbar />
        <Hosts />
      </HostCountProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
