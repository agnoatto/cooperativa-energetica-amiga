
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import { CooperadoFormValues } from "./schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditCard, Info, User } from "lucide-react";

interface BasicInfoFieldsProps {
  form: UseFormReturn<CooperadoFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  const tipoPessoa = form.watch("tipo_pessoa");
  const documentoMask = tipoPessoa === "PJ" 
    ? "99.999.999/9999-99" 
    : "999.999.999-99";

  return (
    <>
      <FormField
        control={form.control}
        name="numero_cadastro"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel className="flex items-center gap-2">
              Número de Cadastro
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número único de identificação do cooperado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Número de cadastro do cooperado" 
                {...field} 
                className="pl-10"
              />
            </FormControl>
            <User className="h-4 w-4 absolute left-3 top-9 text-muted-foreground" />
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
              <Input 
                placeholder={tipoPessoa === "PJ" ? "Razão social da empresa" : "Nome completo"} 
                {...field} 
                className="pl-10"
              />
            </FormControl>
            <User className="h-4 w-4 absolute left-3 top-9 text-muted-foreground" />
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
              <div className="relative">
                <InputMask
                  mask={documentoMask}
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps: any) => (
                    <Input
                      placeholder={tipoPessoa === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
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
    </>
  );
}
