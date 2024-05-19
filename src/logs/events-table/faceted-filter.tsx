import { Check, ChevronsUpDown } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandInput,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react/jsx-runtime";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { EventType } from "@/lan/types";

type FacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title: string;
  options: {
    label: string;
    value: string | EventType;
    component: React.ComponentType<{ label: string }>;
  }[];
  headers?: {
    title: string;
    group: any[];
  }[];
};

export function FacetedFilter<TData, TValue>({
  column,
  title,
  options,
  headers,
}: FacetedFilterProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const filteredOptions = useMemo(() => {
    if (headers) {
      return options;
    }
    return search
      ? options.filter((option) => {
          // Check if the label is an IP address
          const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(option.label);
          if (isIP) {
            // If it's an IP address, filter based on the last part of the IP
            const ipParts = option.label.split(".");
            const lastPart = ipParts[ipParts.length - 1];
            return lastPart.includes(search);
          } else {
            // If it's not an IP address, filter based on the entire label
            return option.label.toLowerCase().includes(search.toLowerCase());
          }
        })
      : options;
  }, [search, headers]);

  const renderCommandItem = (option: {
    label: string;
    value: string;
    component: React.ComponentType<{ label: string }>;
  }) => {
    const isSelected = selectedValues.has(option.value);
    const LabelComponent = option.component;
    return (
      <CommandItem
        key={option.value}
        onSelect={() => {
          if (isSelected) {
            selectedValues.delete(option.value);
          } else {
            selectedValues.add(option.value);
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
        <LabelComponent label={option.label} />
        {facets?.get(option.value) && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {facets.get(option.value)}
          </span>
        )}
      </CommandItem>
    );
  };

  const renderCommandList = () => {
    return (
      <>
        <CommandEmpty>No results found.</CommandEmpty>
        {headers ? (
          headers.map(({ title, group }, index, array) => (
            <Fragment key={title}>
              <CommandGroup heading={title}>
                {options
                  .filter((option) => group.includes(option.label))
                  .map(renderCommandItem)}
              </CommandGroup>
              {index < array.length - 1 && (
                <CommandSeparator className="mr-1" />
              )}
            </Fragment>
          ))
        ) : (
          <CommandGroup>{options.map(renderCommandItem)}</CommandGroup>
        )}
      </>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {title}
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
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
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Command>
          {filteredOptions.length + (headers?.length ?? 0) > 9 ? (
            <>
              {!headers && (
                <CommandInput
                  placeholder={`Search by ${title}`}
                  className="h-10"
                  value={search}
                  onValueChange={setSearch}
                />
              )}
              <ScrollArea className="h-80">
                <CommandList className="max-h-full w-full pr-2">
                  {renderCommandList()}
                </CommandList>
              </ScrollArea>
            </>
          ) : (
            <>
              {!headers && (
                <CommandInput
                  placeholder={`Search by ${title}`}
                  className="h-10"
                  value={search}
                  onValueChange={setSearch}
                />
              )}
              <CommandList>{renderCommandList()}</CommandList>
            </>
          )}
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
