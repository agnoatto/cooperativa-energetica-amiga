
/**
 * Componente para edição de observações da fatura
 * 
 * Este componente fornece um campo de texto grande para inserção
 * de observações relacionadas à fatura que serão exibidas no PDF.
 */
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ObservacaoSectionProps {
  formState: UseFormReturn<any>;
}

export function ObservacaoSection({ formState }: ObservacaoSectionProps) {
  return (
    <FormField
      control={formState.control}
      name="observacao"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações da Fatura</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Adicione aqui observações importantes que aparecerão no PDF da fatura"
              className="min-h-[100px]" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
