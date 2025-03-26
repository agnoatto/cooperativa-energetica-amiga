
/**
 * Seção de observação no formulário de edição de faturas
 * 
 * Exibe e permite editar a observação da fatura, com contador de caracteres
 * e limite para evitar problemas no PDF. 
 * Implementa o modo somente leitura quando a fatura está em status que não permite edição.
 */
import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ObservacaoSectionProps {
  formState: any;
  readOnly?: boolean;
}

export function ObservacaoSection({ formState, readOnly = false }: ObservacaoSectionProps) {
  // Limite de caracteres para a observação
  const maxChars = 500;
  const [charCount, setCharCount] = useState(0);
  
  // Atualizar contador ao montar o componente
  useEffect(() => {
    const value = formState.getValues("observacao") || "";
    setCharCount(value.length);
  }, [formState]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Observação</h3>
      <FormField
        control={formState.control}
        name="observacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observação da Fatura</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  placeholder="Adicione informações relevantes sobre a fatura..."
                  className="resize-none min-h-[100px]"
                  maxLength={maxChars}
                  onChange={(e) => {
                    field.onChange(e);
                    setCharCount(e.target.value.length);
                  }}
                  disabled={readOnly}
                />
                <div 
                  className={`text-xs absolute right-2 bottom-2 ${
                    charCount > maxChars * 0.8 
                      ? charCount > maxChars * 0.9 
                        ? "text-red-500" 
                        : "text-amber-500"
                      : "text-gray-400"
                  }`}
                >
                  {charCount}/{maxChars}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
