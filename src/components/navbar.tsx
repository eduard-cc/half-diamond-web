import { Button } from "./ui/button";
import { Network, Terminal } from "lucide-react";
import { useHostCount } from "@/lan/use-host-count";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const { hostCount } = useHostCount();

  return (
    <nav className="container mx-auto mb-2 flex justify-between pt-5">
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="relative flex h-12 w-12 flex-col p-0 text-muted-foreground"
        >
          <Network size={20} />
          <p>LAN</p>
          {hostCount > 0 && (
            <div className="absolute right-[-2px] top-[-2px] rounded-full bg-primary px-[6px] py-[2px] text-xs text-white">
              {hostCount}
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex h-12 w-12 flex-col p-0 text-muted-foreground"
        >
          <Terminal size={20} />
          <p>Logs</p>
        </Button>
      </div>
      <ThemeToggle />
    </nav>
  );
}
