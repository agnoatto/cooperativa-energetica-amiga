
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { IntegracaoCoraFormValues } from "../types/integracao-cora";

interface ConfiguracoesBoletoFieldsProps {
  form: UseFormReturn<IntegracaoCoraFormValues>;
}

export function ConfiguracoesBoletoFields({ form }: ConfiguracoesBoletoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="configuracoes_boleto.multa.percentual"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Multa (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="configuracoes_boleto.juros.percentual"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Juros ao mês (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
