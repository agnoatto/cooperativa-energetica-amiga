import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "../schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFieldsProps {
  form: UseFormReturn<UsinaFormData>;
  investidores: Array<{ id: string; nome_investidor: string }>;
  unidades: Array<{
    id: string;
    numero_uc: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  }>;
}

export function BasicInfoFields({ form, investidores, unidades }: BasicInfoFieldsProps) {
  const formatAddress = (unidade: BasicInfoFieldsProps['unidades'][0]) => {
    const parts = [
      unidade.logradouro,
      unidade.numero,
      unidade.complemento,
      unidade.cidade,
      unidade.uf,
      unidade.cep,
    ].filter(Boolean);
    return `${unidade.numero_uc} - ${parts.join(", ")}`;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="investidor_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investidor</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o investidor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {investidores?.map((investidor) => (
                  <SelectItem key={investidor.id} value={investidor.id}>
                    {investidor.nome_investidor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unidade_usina_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {unidades?.map((unidade) => (
                  <SelectItem key={unidade.id} value={unidade.id}>
                    {formatAddress(unidade)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}