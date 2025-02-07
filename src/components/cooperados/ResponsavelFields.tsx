
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import { CooperadoFormValues } from "./schema";
import { CreditCard, Phone, User } from "lucide-react";

interface ResponsavelFieldsProps {
  form: UseFormReturn<CooperadoFormValues>;
}

export function ResponsavelFields({ form }: ResponsavelFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="responsavel_nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Responsável</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Nome do responsável" 
                  {...field} 
                  className="pl-10"
                />
                <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsavel_cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF do Responsável</FormLabel>
            <FormControl>
              <div className="relative">
                <InputMask
                  mask="999.999.999-99"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps: any) => (
                    <Input
                      placeholder="000.000.000-00"
                      {...inputProps}
                      className="pl-10"
                    />
                  )}
                </InputMask>
                <CreditCard className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsavel_telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone do Responsável</FormLabel>
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
    </>
  );
}
