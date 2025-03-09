
/**
 * Seção para edição de valores de desconto e assinatura
 *
 * Este componente permite visualizar e editar os valores de desconto e assinatura
 * nas faturas, incluindo um botão para calcular automaticamente estes valores.
 */
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DescontoAssinaturaSectionProps {
  formState: UseFormReturn<any>;
  localValorDesconto: number;
  setLocalValorDesconto: (value: number) => void;
  localValorAssinatura: number;
  setLocalValorAssinatura: (value: number) => void;
  isCalculating: boolean;
  onCalcularClick: () => void;
}

export function DescontoAssinaturaSection({
  formState,
  localValorDesconto,
  setLocalValorDesconto,
  localValorAssinatura,
  setLocalValorAssinatura,
  isCalculating,
  onCalcularClick,
}: DescontoAssinaturaSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField
            control={formState.control}
            name="valor_desconto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Desconto</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="Valor do desconto"
                    value={localValorDesconto}
                    onValueChange={setLocalValorDesconto}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={formState.control}
            name="valor_assinatura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Assinatura</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="Valor da assinatura"
                    value={localValorAssinatura}
                    onValueChange={setLocalValorAssinatura}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Button type="button" onClick={onCalcularClick} disabled={isCalculating}>
        {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Calcular
      </Button>
    </>
  );
}
