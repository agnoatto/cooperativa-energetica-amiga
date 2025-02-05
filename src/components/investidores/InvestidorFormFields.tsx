import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InvestidorFormData } from "./types";
import InputMask from "react-input-mask";
import MaskedInput from "./MaskedInput";

interface InvestidorFormFieldsProps {
  form: UseFormReturn<InvestidorFormData>;
}

export function InvestidorFormFields({ form }: InvestidorFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nome_investidor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Investidor</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="documento"
        render={({ field: { onChange, value, ref, ...field } }) => (
          <FormItem>
            <FormLabel>CPF/CNPJ</FormLabel>
            <FormControl>
              <InputMask
                mask={value.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                value={value}
                onChange={onChange}
                {...field}
              >
                {(inputProps: any) => (
                  <MaskedInput {...inputProps} ref={ref} />
                )}
              </InputMask>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="telefone"
        render={({ field: { onChange, value, ref, ...field } }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <InputMask
                mask="(99) 99999-9999"
                value={value}
                onChange={onChange}
                {...field}
              >
                {(inputProps: any) => (
                  <MaskedInput {...inputProps} ref={ref} />
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
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}