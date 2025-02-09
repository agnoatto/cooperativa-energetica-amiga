
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "../schema";

interface FinancialStepProps {
  form: UseFormReturn<UsinaFormData>;
}

export function FinancialStep({ form }: FinancialStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="valor_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do kWh</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
