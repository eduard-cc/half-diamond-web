import { Button } from "./ui/button";
import { Network, Terminal } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Link } from "react-router-dom";
import { useHosts } from "@/providers/hosts-provider";

export default function Navbar() {
  const { onlineHostsCount } = useHosts();

  return (
    <nav className="container mx-auto mb-2 flex justify-between pt-5">
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="relative flex h-12 w-12 flex-col p-0"
          asChild
        >
          <Link to="/">
            <Network size={20} />
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
          className="flex h-12 w-12 flex-col p-0"
          asChild
        >
          <Link to="/events">
            <Terminal size={20} />
            <p>Events</p>
          </Link>
        </Button>
      </div>
      <ThemeToggle />
    </nav>
  );
}
