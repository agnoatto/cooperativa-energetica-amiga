
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import { CooperadoFormValues } from "./schema";
import { Mail, Phone } from "lucide-react";

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
              <div className="relative">
                <InputMask
                  mask="(99) 99999-9999"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps: any) => (
                    <Input
                      placeholder="(00) 00000-0000"
                      {...inputProps}
                      className="pl-10"
                    />
                  )}
                </InputMask>
                <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
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
              <div className="relative">
                <Input 
                  placeholder="email@exemplo.com" 
                  {...field} 
                  className="pl-10"
                />
                <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
