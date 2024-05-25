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
import { PortScanType } from "@/types/port-scan-type";
import { ChevronDown } from "lucide-react";

type PortScanTypeDropdownProps = {
  disabled: boolean;
  scanType: PortScanType;
  setScanType: React.Dispatch<React.SetStateAction<PortScanType>>;
};

const scanTypeDetails = {
  [PortScanType.SYN]: "TCP SYN",
  [PortScanType.TCP]: "TCP",
  [PortScanType.UDP]: "UDP",
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
          className="z-10 rounded-r-none border-transparent md:h-8 md:border-r-0 md:border-input"
        >
          <span className="hidden md:block">{scanTypeDetails[scanType]}</span>
          <span className="md:hidden">Port scan type</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          width:
            "calc(var(--radix-dropdown-menu-trigger-width) + 0.5rem + 1px)",
        }}
      >
        <div className="hidden md:block">
          <DropdownMenuLabel>Port scan type</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuRadioGroup
          value={scanType}
          onValueChange={(value) => setScanType(value as PortScanType)}
        >
          {Object.entries(scanTypeDetails).map(([value, displayName]) => (
            <DropdownMenuRadioItem key={value} value={value as PortScanType}>
              <p>{displayName}</p>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
