
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import { CooperadoFormValues } from "./schema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<CooperadoFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  const tipoPessoa = form.watch("tipo_pessoa");
  const documentoMask = form.watch("documento")?.length > 11 
    ? "99.999.999/9999-99" 
    : "999.999.999-99";

  return (
    <>
      <FormField
        control={form.control}
        name="numero_cadastro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Cadastro</FormLabel>
            <FormControl>
              <Input placeholder="Número de cadastro do cooperado" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tipo_pessoa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="PF">Pessoa Física</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {tipoPessoa === "PJ" ? "Razão Social" : "Nome"}
            </FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="documento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
            </FormLabel>
            <FormControl>
              <InputMask
                mask={documentoMask}
                value={field.value}
                onChange={field.onChange}
              >
                {(inputProps: any) => (
                  <Input
                    placeholder={tipoPessoa === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                    {...inputProps}
                  />
                )}
              </InputMask>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
