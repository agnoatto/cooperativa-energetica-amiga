
/**
 * Campos básicos para formulário de usinas fotovoltaicas
 * 
 * Este componente apresenta os campos básicos para cadastro e edição de usinas,
 * incluindo investidor, unidade, valor do kWh e potência instalada.
 */
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { InvestidorSelect } from "./InvestidorSelect";
import { UnidadeUsinaSelect } from "./UnidadeUsinaSelect";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { GeracaoPrevisaoDialog } from "./GeracaoPrevisaoDialog";

interface UsinaBasicInfoFieldsProps {
  form: UseFormReturn<UsinaFormData>;
  usinaId?: string;
}

export function UsinaBasicInfoFields({ form, usinaId }: UsinaBasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InvestidorSelect form={form} />
        <UnidadeUsinaSelect form={form} usinaId={usinaId} />

        <FormField
          control={form.control}
          name="valor_kwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do kWh</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value || 0}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="potencia_instalada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potência Instalada (kWp)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="flex items-end">
          <GeracaoPrevisaoDialog usinaId={usinaId} />
        </div>
      </div>
    </div>
  );
}
