import ModuleLauncherButton from "./module-launcher-button";
import type { Module } from "./hooks/use-module";
import { useHosts } from "@/providers/hosts-provider";
import { Host } from "./types";
import { useCallback, useMemo } from "react";
import { ArpSpoofDialog } from "./arp-spoof-dialog";

type ModuleLauncherToolbarProps = {
  monitor: Module;
  probe: Module;
  arpSpoof: Module;
};

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

export default function ModuleLauncherToolbar({
  monitor,
  probe,
  arpSpoof,
}: ModuleLauncherToolbarProps) {
  const { hosts } = useHosts();
  const { ips, gatewayIp, hostIp } = useMemo(
    () => processHosts(hosts),
    [hosts],
  );

  const handleModuleClick = useCallback(async (module: Module) => {
    module.isRunning ? await module.stop() : await module.start();
  }, []);
  const handleMonitorClick = () => handleModuleClick(monitor);
  const handleProbeClick = () => handleModuleClick(probe);
  const handleArpSpoofClick = () => handleModuleClick(arpSpoof);

  return (
    <>
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
      />
    </>
  );
}
