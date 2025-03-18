
/**
 * Campo de Data Próxima Leitura para o formulário de edição de faturas
 * 
 * Este componente exibe um campo de data para registrar a próxima leitura
 * da conta de energia, facilitando o controle do usuário sobre quais contas
 * já foram lidas.
 */
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DataProximaLeituraFieldProps {
  formState: UseFormReturn<any>;
}

export function DataProximaLeituraField({ formState }: DataProximaLeituraFieldProps) {
  return (
    <FormField
      control={formState.control}
      name="data_proxima_leitura"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Data Próxima Leitura</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              {...field} 
              value={field.value || ""}
              placeholder="Selecione a data da próxima leitura"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
