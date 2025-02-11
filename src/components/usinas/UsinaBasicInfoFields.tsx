
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { InvestidorSelect } from "./InvestidorSelect";
import { UnidadeUsinaSelect } from "./UnidadeUsinaSelect";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";

interface UsinaBasicInfoFieldsProps {
  form: UseFormReturn<UsinaFormData>;
}

export function UsinaBasicInfoFields({ form }: UsinaBasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InvestidorSelect form={form} />
      <UnidadeUsinaSelect form={form} />

      <FormField
        control={form.control}
        name="valor_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do kWh</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value.toString()}
                onChange={(value) => {
                  const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                  field.onChange(numericValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data_inicio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Início</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  field.onChange(date);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
