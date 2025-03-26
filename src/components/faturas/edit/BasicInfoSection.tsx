
/**
 * Seção de informações básicas da fatura no formulário de edição
 * 
 * Exibe e permite editar informações como consumo, datas e saldo de energia.
 * Implementa o modo somente leitura quando a fatura está em status que não permite edição.
 */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

interface BasicInfoSectionProps {
  formState: any;
  readOnly?: boolean;
}

export function BasicInfoSection({ formState, readOnly = false }: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Consumo kWh */}
      <FormField
        control={formState.control}
        name="consumo_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo (kWh)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                placeholder="0" 
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Data de Vencimento */}
      <FormField
        control={formState.control}
        name="data_vencimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Vencimento</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Data Próxima Leitura */}
      <FormField
        control={formState.control}
        name="data_proxima_leitura"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Próxima Leitura</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Economia Acumulada */}
      <FormField
        control={formState.control}
        name="economia_acumulada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Economia Acumulada (R$)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Saldo Energia kWh */}
      <FormField
        control={formState.control}
        name="saldo_energia_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Saldo Energia (kWh)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                placeholder="0" 
                disabled={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
