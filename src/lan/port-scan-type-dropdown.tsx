import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PortScanType } from "./types";
import { ChevronsUpDown } from "lucide-react";

type PortScanTypeDropdownProps = {
  disabled: boolean;
  scanType: PortScanType;
  setScanType: React.Dispatch<React.SetStateAction<PortScanType>>;
};

const scanTypeDetails = {
  [PortScanType.SYN]: {
    displayName: "TCP SYN",
    description: "Half-open scan. Fast and stealthy.",
  },
  [PortScanType.TCP]: {
    displayName: "TCP",
    description: "Full connect scan. Slower and more detectable.",
  },
  [PortScanType.UDP]: {
    displayName: "UDP",
    description: "For services that use UDP.",
  },
};

export default function PortScanTypeDropdown({
  disabled,
  scanType,
  setScanType,
}: PortScanTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="z-10 h-8 rounded-r-none border-r-0"
        >
          {scanTypeDetails[scanType].displayName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Port scan type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={scanType}
          onValueChange={(value) => setScanType(value as PortScanType)}
        >
          {Object.entries(scanTypeDetails).map(
            ([value, { displayName, description }]) => (
              <DropdownMenuRadioItem key={value} value={value as PortScanType}>
                <div>
                  <p>{displayName}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </DropdownMenuRadioItem>
            ),
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
