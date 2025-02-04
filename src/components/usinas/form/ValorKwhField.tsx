import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "../schema";

interface ValorKwhFieldProps {
  form: UseFormReturn<UsinaFormData>;
}

export function ValorKwhField({ form }: ValorKwhFieldProps) {
  return (
    <FormField
      control={form.control}
      name="valor_kwh"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor do kWh</FormLabel>
          <FormControl>
            <Input {...field} type="number" step="0.01" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}