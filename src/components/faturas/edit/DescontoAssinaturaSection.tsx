
/**
 * Seção de desconto e assinatura no formulário de edição de faturas
 * 
 * Exibe e permite editar/calcular os valores de desconto e assinatura da fatura.
 * Implementa o modo somente leitura quando a fatura está em status que não permite edição.
 */
import { useState, useEffect } from "react";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface DescontoAssinaturaSectionProps {
  formState: any;
  localValorDesconto: number;
  setLocalValorDesconto: (value: number) => void;
  localValorAssinatura: number;
  setLocalValorAssinatura: (value: number) => void;
  isCalculating: boolean;
  onCalcularClick: () => void;
  readOnly?: boolean;
}

export function DescontoAssinaturaSection({
  formState,
  localValorDesconto,
  setLocalValorDesconto,
  localValorAssinatura,
  setLocalValorAssinatura,
  isCalculating,
  onCalcularClick,
  readOnly = false
}: DescontoAssinaturaSectionProps) {
  const [displayValorDesconto, setDisplayValorDesconto] = useState<string>(
    localValorDesconto.toFixed(2).replace('.', ',')
  );
  const [displayValorAssinatura, setDisplayValorAssinatura] = useState<string>(
    localValorAssinatura.toFixed(2).replace('.', ',')
  );

  // Atualizar exibições quando os valores locais mudarem
  useEffect(() => {
    setDisplayValorDesconto(localValorDesconto.toFixed(2).replace('.', ','));
  }, [localValorDesconto]);

  useEffect(() => {
    setDisplayValorAssinatura(localValorAssinatura.toFixed(2).replace('.', ','));
  }, [localValorAssinatura]);

  // Função para converter string formatada para número
  const parseValue = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').trim();
    return parseFloat(cleanValue.replace(',', '.'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Desconto e Assinatura</h3>
        <Button
          type="button"
          variant="outline"
          onClick={onCalcularClick}
          disabled={isCalculating || readOnly}
        >
          {isCalculating ? "Calculando..." : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calcular
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valor Desconto */}
        <FormItem>
          <FormLabel>Valor Desconto</FormLabel>
          <CurrencyInput
            value={displayValorDesconto}
            onValueChange={(value) => {
              setDisplayValorDesconto(value);
              setLocalValorDesconto(parseValue(value));
            }}
            placeholder="0,00"
            disabled={readOnly}
          />
        </FormItem>

        {/* Valor Assinatura */}
        <FormItem>
          <FormLabel>Valor Assinatura</FormLabel>
          <CurrencyInput
            value={displayValorAssinatura}
            onValueChange={(value) => {
              setDisplayValorAssinatura(value);
              setLocalValorAssinatura(parseValue(value));
            }}
            placeholder="0,00"
            disabled={readOnly}
          />
        </FormItem>
      </div>
    </div>
  );
}
