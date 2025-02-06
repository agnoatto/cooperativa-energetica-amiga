
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
          <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between bg-white border-2 min-h-[42px] transition-all duration-200",
                    "hover:bg-gray-50 focus:ring-2 focus:ring-blue-100",
                    !field.value && "text-gray-500",
                    open ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-300"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  ) : selectedLabel ? (
                    <span className="text-gray-900">{selectedLabel}</span>
                  ) : (
                    <span className="text-gray-500">{placeholder}</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg border border-gray-200" 
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <div className="flex items-center border-b border-gray-200 px-3 py-2">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-9 flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
                {searchValue && (
                  <X
                    className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => onSearchChange("")}
                  />
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto bg-white">
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
