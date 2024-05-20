import ModuleLauncherButton from "./module-launcher-button";
import type { Module } from "./hooks/use-module";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiSelectDropdown } from "./multi-select-dropdown";
import { useHosts } from "@/providers/hosts-provider";

type ModuleLauncherToolbarProps = {
  monitor: Module;
  probe: Module;
  arpSpoof: Module;
};

export default function ModuleLauncherToolbar({
  monitor,
  probe,
  arpSpoof,
}: ModuleLauncherToolbarProps) {
  const { hosts: hostObjects } = useHosts();
  const hosts = hostObjects.map((host) => host.ip);
  const handleModuleClick = async (module: Module) => {
    module.isRunning ? await module.stop() : await module.start();
  };

  return (
    <>
      <ModuleLauncherButton
        module={monitor}
        onClick={() => handleModuleClick(monitor)}
        moduleName="Monitor"
      />
      <ModuleLauncherButton
        module={probe}
        onClick={() => handleModuleClick(probe)}
        moduleName="Probe"
        monitorIsRunning={monitor.isRunning}
      />
      <Dialog>
        <DialogTrigger asChild>
          <ModuleLauncherButton module={arpSpoof} moduleName="ARP Spoof" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ARP Spoof</DialogTitle>
            <DialogDescription>
              This module performs a MITM attack that intercepts traffic of
              selected hosts using spoofed ARP packets.
            </DialogDescription>
          </DialogHeader>
          <div>
            <MultiSelectDropdown
              options={hosts}
              triggerTitle="Select target hosts"
              searchTitle="Search by IP"
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleModuleClick(arpSpoof)}>
              Start ARP spoof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
