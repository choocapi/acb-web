"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboBox({
  data,
  type = "category",
  onSelect,
}: {
  data: any[];
  type?: "category" | "brand";
  onSelect?: (selected: any | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const translateType = (type: string) => {
    if (type === "category") {
      return "danh mục";
    } else if (type === "brand") {
      return "thương hiệu";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((item) => item.id === value)?.name
            : `Chọn ${translateType(type)}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={`Tìm ${translateType(type)}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy {translateType(type)}.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);

                    onSelect?.(newValue || null);
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
