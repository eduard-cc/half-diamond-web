import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiSelectDropdown } from "./multi-select-dropdown";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Module } from "./hooks/use-module";
import ModuleLauncherButton from "./module-launcher-button";

type ArpSpoofDialogProps = {
  arpSpoof: Module;
  ips: string[];
  gatewayIp: string;
  hostIp: string;
  handleClick: () => void;
  targetIps: string[];
};

export function ArpSpoofDialog({
  arpSpoof,
  ips,
  gatewayIp,
  hostIp,
  handleClick,
  targetIps,
}: ArpSpoofDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ModuleLauncherButton
          module={arpSpoof}
          moduleName="ARP Spoof"
          targetIps={targetIps}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[31rem]">
        <DialogHeader>
          <DialogTitle>ARP Spoof</DialogTitle>
          <DialogDescription>
            This module performs a MITM attack that intercepts network traffic
            of selected hosts using spoofed ARP packets.
          </DialogDescription>
        </DialogHeader>
        <>
          <div className="grid">
            <Label className="mb-2">Target hosts</Label>
            <MultiSelectDropdown
              options={ips}
              preselectedOptions={targetIps}
              triggerTitle="Select target hosts"
              searchTitle="Search by IP"
              limit={5}
            />
          </div>
          <div className="grid">
            <Label className="mb-2">Gateway</Label>
            <Badge
              variant="secondary"
              className="w-fit px-2 py-[0.1rem] text-sm"
            >
              {gatewayIp}
            </Badge>
          </div>
          <div className="grid">
            <Label className="mb-2">Host</Label>
            <Badge
              variant="secondary"
              className="w-fit px-2 py-[0.1rem] text-sm"
            >
              {hostIp}
            </Badge>
          </div>
        </>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleClick}>
            Start ARP spoofing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
