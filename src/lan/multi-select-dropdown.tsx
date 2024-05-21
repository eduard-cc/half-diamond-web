import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type MultiSelectDropdownProps = {
  triggerTitle?: string;
  searchTitle?: string;
  options: string[];
  preselectedOptions?: string[];
  limit?: number;
};

export function MultiSelectDropdown({
  triggerTitle,
  options,
  searchTitle,
  limit,
  preselectedOptions = [],
}: MultiSelectDropdownProps) {
  const [selectedValues, setSelectedValues] = useState(
    new Set(preselectedOptions),
  );
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-fit">
            {triggerTitle}
            <ChevronDown className="ml-2 h-4 w-4" />
            {selectedValues.size > 0 && (
              <>
                {" "}
                <Separator orientation="vertical" className="mx-2 h-4" />
                <p
                  className={cn("text-xs text-muted-foreground", {
                    "text-foreground": selectedValues.size >= 5,
                  })}
                >
                  {selectedValues.size}/5 selected
                </p>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchTitle} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option);
                  const isDisabled = Boolean(
                    limit && !isSelected && selectedValues.size >= limit,
                  );
                  return (
                    <CommandItem
                      disabled={isDisabled}
                      key={option}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option);
                        } else if (limit && selectedValues.size < limit) {
                          selectedValues.add(option);
                        }
                        setSelectedValues(new Set(selectedValues));
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selectedValues.size > 0 && (
              <CommandList>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set());
                    }}
                    className="justify-center text-center"
                  >
                    Deselect all
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {selectedValues?.size > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {options
              .filter((option) => selectedValues.has(option))
              .map((option) => (
                <Badge
                  variant="secondary"
                  key={option}
                  className="p-0 pl-2 text-sm"
                >
                  {option}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex h-full items-center px-2 py-1 text-muted-foreground hover:cursor-pointer hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectedValues.delete(option);
                            setSelectedValues(new Set(selectedValues));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-normal">Remove target</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
