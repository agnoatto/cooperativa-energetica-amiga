
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BasicInfoFieldsProps } from "./types";

export function UnidadeBeneficiariaBasicInfo({ form }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="numero_uc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da UC</FormLabel>
            <FormControl>
              <Input placeholder="Número da UC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="apelido"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apelido (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Apelido da unidade" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="percentual_desconto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Desconto</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0.00"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
