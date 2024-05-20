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

type MultiSelectDropdownProps = {
  triggerTitle?: string;
  searchTitle?: string;
  options: string[];
};

export function MultiSelectDropdown({
  triggerTitle,
  options,
  searchTitle,
}: MultiSelectDropdownProps) {
  const [selectedValues, setSelectedValues] = useState(new Set<string>());

  return (
    <>
      {selectedValues?.size > 0 && (
        <>
          <Badge variant="secondary" className="mb-4 text-sm lg:hidden">
            {selectedValues.size}
          </Badge>
          <div className="mb-4 hidden gap-1 lg:flex lg:flex-wrap">
            {options
              .filter((option) => selectedValues.has(option))
              .map((option) => (
                <Badge
                  variant="secondary"
                  key={option}
                  className="p-0 pl-2 text-sm"
                >
                  {option}
                  <div
                    className="flex h-full items-center px-2 py-1 text-secondary-foreground/50 hover:cursor-pointer hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedValues.delete(option);
                      setSelectedValues(new Set(selectedValues));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </div>
                </Badge>
              ))}
          </div>
        </>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {triggerTitle}
            <ChevronDown className="ml-2 h-4 w-4" />
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
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option);
                        } else {
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
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
