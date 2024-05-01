import { Button } from "./ui/button";
import { Network } from "lucide-react";
import { useHostCount } from "@/lan/use-host-count";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const { hostCount } = useHostCount();

  return (
    <div className="container mx-auto flex justify-between pt-5">
      <Button variant="outline" className="relative flex h-16 w-16 flex-col">
        <Network size={20} />
        <p>LAN</p>
        {hostCount > 0 && (
          <div className="absolute right-1 top-1 rounded-full bg-gray-400 px-[6px] py-[2px] text-xs text-white">
            {hostCount}
          </div>
        )}
      </Button>
      <ThemeToggle />
    </div>
  );
}
