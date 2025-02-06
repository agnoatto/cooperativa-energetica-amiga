
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SapSelectBaseProps {
  name: string;
  form: UseFormReturn<any>;
  label: string;
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedLabel?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SapSelectBase({
  name,
  form,
  label,
  isLoading,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  selectedLabel,
  children,
  open,
  onOpenChange,
}: SapSelectBaseProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between border-2 min-h-[42px]",
                    !field.value && "text-muted-foreground",
                    open && "border-blue-600 ring-2 ring-blue-100"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  ) : selectedLabel ? (
                    selectedLabel
                  ) : (
                    placeholder
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[--radix-popover-trigger-width] p-0" 
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <div className="flex items-center border-b px-3 py-2">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-8 flex-1 border-0 focus-visible:ring-0"
                />
                {searchValue && (
                  <X
                    className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => onSearchChange("")}
                  />
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto bg-popover">
                {children}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
