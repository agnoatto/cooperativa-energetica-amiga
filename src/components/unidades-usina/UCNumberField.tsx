
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export function UCNumberField() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="numero_uc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número UC *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Digite o número da UC"
                disabled={form.formState.isSubmitting}
              />
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
            <FormLabel>Apelido</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Digite um apelido para a unidade"
                disabled={form.formState.isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
