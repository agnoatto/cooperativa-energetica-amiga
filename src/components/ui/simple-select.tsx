
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface SimpleSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  isLoading?: boolean;
  placeholder?: string;
}

export function SimpleSelect({
  form,
  name,
  label,
  options,
  isLoading,
  placeholder = "Selecione...",
}: SimpleSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {options.length === 0 ? (
                <div className="p-2 text-sm text-gray-500 text-center">
                  Nenhum item encontrado
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

