import { Check, Filter } from "lucide-react";
import { Column } from "@tanstack/react-table";
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
import { Separator } from "@/components/ui/separator";
import { EventType } from "@/lan/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react/jsx-runtime";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

const eventGroups = {
  "Host Events": [
    EventType.HOST_NEW,
    EventType.HOST_CONNECTED,
    EventType.HOST_DISCONNECTED,
  ],
  "Scan Events": [EventType.SCAN_SYN, EventType.SCAN_TCP, EventType.SCAN_UDP],
  "OS Events": [EventType.OS_DETECTED],
};

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const options = Object.values(EventType).filter(
    (option) => option !== EventType.HOST_SEEN,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search event type" className="h-10" />
          <ScrollArea className="h-72">
            <CommandList className="max-h-full pr-2">
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(eventGroups).map(
                ([heading, eventTypes], index, array) => (
                  <Fragment key={heading}>
                    <CommandGroup heading={heading}>
                      {eventTypes.map((eventType) => {
                        const option = eventType;
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
                              const filterValues = Array.from(selectedValues);
                              column?.setFilterValue(
                                filterValues.length ? filterValues : undefined,
                              );
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
                            {facets?.get(option) && (
                              <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                {facets.get(option)}
                              </span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    {index < array.length - 1 && (
                      <CommandSeparator className="mr-1" />
                    )}
                  </Fragment>
                ),
              )}
            </CommandList>
          </ScrollArea>
          {selectedValues.size > 0 && (
            <CommandList>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => column?.setFilterValue(undefined)}
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
  );
}
