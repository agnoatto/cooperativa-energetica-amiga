import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import { CooperadoFormValues } from "./schema";

interface ContatoFieldsProps {
  form: UseFormReturn<CooperadoFormValues>;
}

export function ContatoFields({ form }: ContatoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <InputMask
                mask="(99) 99999-9999"
                value={field.value}
                onChange={field.onChange}
              >
                {(inputProps: any) => (
                  <Input
                    placeholder="(00) 00000-0000"
                    {...inputProps}
                  />
                )}
              </InputMask>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="email@exemplo.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}