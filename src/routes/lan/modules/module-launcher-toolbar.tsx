import ModuleLauncherButton from "./module-launcher-button";
import type { Module } from "../hooks/use-module";
import type { Host } from "@/types/host";
import { useHosts } from "@/providers/hosts-provider";
import { useCallback, useMemo } from "react";
import { ArpSpoofDialog } from "./arp-spoof-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type ModuleLauncherToolbarProps = {
  monitor: Module;
  probe: Module;
  arpSpoof: Module;
  targetIps: string[];
};

export default function ModuleLauncherToolbar({
  monitor,
  probe,
  arpSpoof,
  targetIps,
}: ModuleLauncherToolbarProps) {
  const { hosts } = useHosts();
  const { ips, gatewayIp, hostIp } = useMemo(
    () => processHosts(hosts),
    [hosts],
  );

  const validTargetIps = useMemo(() => {
    return targetIps.filter((ip) => ips.includes(ip));
  }, [targetIps]);

  const handleClick = useCallback(
    async (module: Module, selectedIps?: Set<string>) => {
      if (module.isRunning) {
        await module.stop();
      } else {
        await module.start(selectedIps ? Array.from(selectedIps) : []);
      }
    },
    [],
  );

  const handleMonitorClick = () => handleClick(monitor);
  const handleProbeClick = () => handleClick(probe);
  const handleArpSpoofClick = (selectedIps: Set<string>) =>
    handleClick(arpSpoof, new Set(selectedIps));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex 2xl:hidden">
          <Button variant="outline" size="sm" className="h-8">
            Modules
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem asChild>
              <ModuleLauncherButton
                module={monitor}
                onClick={handleMonitorClick}
                moduleName="Monitor"
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ModuleLauncherButton
                module={probe}
                onClick={handleProbeClick}
                moduleName="Probe"
                monitorIsRunning={monitor.isRunning}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ArpSpoofDialog
                arpSpoof={arpSpoof}
                ips={ips}
                gatewayIp={gatewayIp}
                hostIp={hostIp}
                handleClick={handleArpSpoofClick}
                targetIps={validTargetIps}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="hidden gap-2 2xl:flex">
        <ModuleLauncherButton
          module={monitor}
          onClick={handleMonitorClick}
          moduleName="Monitor"
        />
        <ModuleLauncherButton
          module={probe}
          onClick={handleProbeClick}
          moduleName="Probe"
          monitorIsRunning={monitor.isRunning}
        />
        <ArpSpoofDialog
          arpSpoof={arpSpoof}
          ips={ips}
          gatewayIp={gatewayIp}
          hostIp={hostIp}
          handleClick={handleArpSpoofClick}
          targetIps={validTargetIps}
        />
      </div>
    </>
  );
}

function processHosts(hosts: Host[]) {
  let ips: string[] = [];
  let gatewayIp: string = "";
  let hostIp: string = "";

  hosts.forEach((host) => {
    if (host.name === "Gateway") {
      gatewayIp = host.ip;
    } else if (host.name) {
      hostIp = host.ip;
    } else {
      ips.push(host.ip);
    }
  });

  return { ips, gatewayIp, hostIp };
}
