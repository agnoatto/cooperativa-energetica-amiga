
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateFieldsProps {
  form: UseFormReturn<any>;
}

export function UnidadeBeneficiariaDateFields({ form }: DateFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="data_entrada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Entrada</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data_saida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Saída (opcional)</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
