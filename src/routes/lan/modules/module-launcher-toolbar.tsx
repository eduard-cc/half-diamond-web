import ModuleLauncherButton from "./module-launcher-button";
import type { Module } from "../hooks/use-module";
import type { Host } from "@/types/host";
import { useHosts } from "@/providers/hosts-provider";
import { useCallback, useMemo } from "react";
import { ArpSpoofDialog } from "./arp-spoof-dialog";

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
  }, [targetIps, ips]);

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
