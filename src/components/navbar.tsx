import { Button } from "./ui/button";
import { Network, ScrollText } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Link } from "react-router-dom";
import { useHosts } from "@/providers/hosts-provider";
import { useEvents } from "@/providers/events-provider";
import useWebSocket from "@/lan/hooks/use-websocket";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const { onlineHostsCount, setHosts } = useHosts();
  const { setEvents } = useEvents();

  useWebSocket(setHosts, setEvents);

  return (
    <nav className="container mx-auto flex justify-between pt-6">
      <div className="flex gap-4">
        <Button
          variant="outline"
          className={cn(
            "relative flex h-14 w-14 flex-col p-0 text-muted-foreground",
            location.pathname === "/" && "bg-secondary text-foreground",
          )}
          asChild
        >
          <Link to="/">
            <Network className="h-5 w-5" />
            <p>LAN</p>
            {onlineHostsCount > 0 && (
              <div className="absolute right-[-3px] top-[-3px] rounded-full bg-primary px-[6px] py-[2px] text-xs text-primary-foreground">
                {onlineHostsCount}
              </div>
            )}
          </Link>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "flex h-14 w-14 flex-col p-0 text-muted-foreground",
            location.pathname === "/events" && "bg-secondary text-foreground",
          )}
          asChild
        >
          <Link to="/events">
            <ScrollText className="h-5 w-5" />
            <p>Events</p>
          </Link>
        </Button>
      </div>
      <ThemeToggle />
    </nav>
  );
}
