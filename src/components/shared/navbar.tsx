import { Button } from "@/components/ui/button";
import { Network, ScrollText } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Link } from "react-router-dom";
import { useHosts } from "@/providers/hosts-provider";
import { useEvents } from "@/providers/events-provider";
import useWebSocket from "@/routes/lan/hooks/use-websocket";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

export default function Navbar() {
  const location = useLocation();
  const { onlineHostsCount, setHosts } = useHosts();
  const { newEventsCount, setEvents, setNewEventsCount } = useEvents();

  useEffect(() => {
    if (location.pathname === "/events") {
      setNewEventsCount(0);
    }
  }, [location.pathname, setNewEventsCount]);

  useWebSocket(setHosts, setEvents, setNewEventsCount);

  return (
    <nav className="container mx-auto flex justify-between px-2 pt-2 lg:pt-6">
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
              <div className="absolute right-[-7px] top-[-7px] min-w-[20px] rounded-full border border-green-900/20 bg-green-200/80 px-[6px] py-[2px] text-center text-xs text-green-950 dark:border-stone-50/10 dark:bg-green-800 dark:text-green-50">
                <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-600 dark:bg-green-300"></span>
                {onlineHostsCount}
              </div>
            )}
          </Link>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "relative flex h-14 w-14 flex-col p-0 text-muted-foreground",
            location.pathname === "/events" && "bg-secondary text-foreground",
          )}
          asChild
        >
          <Link to="/events">
            <ScrollText className="h-5 w-5" />
            <p>Events</p>
            {newEventsCount > 0 && (
              <div className="absolute right-[-7px] top-[-7px] min-w-[20px] rounded-full bg-primary px-[6px] py-[2px] text-center text-xs text-primary-foreground">
                {newEventsCount}
              </div>
            )}
          </Link>
        </Button>
      </div>
      <ThemeToggle />
    </nav>
  );
}
