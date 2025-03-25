
/**
 * Componente para edição de observações da fatura
 * 
 * Este componente fornece um campo de texto grande para inserção
 * de observações relacionadas à fatura que serão exibidas no PDF.
 * Inclui contador de caracteres para garantir que o texto não exceda
 * o limite e mantenha o PDF em uma única página.
 */
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

// Limite máximo de caracteres para manter o PDF em uma página
const MAX_CHARS = 500;

interface ObservacaoSectionProps {
  formState: UseFormReturn<any>;
}

export function ObservacaoSection({ formState }: ObservacaoSectionProps) {
  const [charCount, setCharCount] = useState(0);
  
  // Atualiza o contador quando o campo de observação muda
  useEffect(() => {
    const observacao = formState.watch("observacao") || "";
    setCharCount(observacao.length);
  }, [formState.watch("observacao")]);

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
              maxLength={MAX_CHARS}
              {...field}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }
              }}
            />
          </FormControl>
          <FormDescription className="flex justify-end">
            <span className={charCount >= MAX_CHARS * 0.9 ? "text-amber-600 font-medium" : ""}>
              {charCount}/{MAX_CHARS} caracteres
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
