"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

type ComboboxSelectProps<T extends { id: number } & object> = {
  label: string;
  placeholder?: string;
  data: T[];
  value: number | null;
  onSelect: (id: number) => void;
  displayKey: keyof T;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

function ComboboxSelect<T extends { id: number } & object>({
  label,
  placeholder = "Selecione uma opção",
  data,
  value,
  onSelect,
  displayKey,
  className = "",
}: ComboboxSelectProps<T>) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const selectedItem = data.find((item) => item.id === value);

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full bg-gray-50 dark:bg-black justify-between"
          >
            {selectedItem ? String(selectedItem[displayKey]) : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command className="w-full">
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onSelect(item.id);
                      setPopoverOpen(false);
                    }}
                    className="w-full"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {String(item[displayKey])}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ComboboxSelect;
