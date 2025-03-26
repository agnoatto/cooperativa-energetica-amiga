
/**
 * Seção de valores da fatura no formulário de edição
 * 
 * Exibe e permite editar os valores monetários da fatura como
 * valor total, fatura da concessionária, iluminação pública e outros valores.
 * Implementa o modo somente leitura quando a fatura está em status que não permite edição.
 */
import { useState, useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";

interface FaturaValoresSectionProps {
  formState: any;
  localTotalFatura: number;
  setLocalTotalFatura: (value: number) => void;
  localFaturaConcessionaria: number;
  setLocalFaturaConcessionaria: (value: number) => void;
  localIluminacaoPublica: number;
  setLocalIluminacaoPublica: (value: number) => void;
  localOutrosValores: number;
  setLocalOutrosValores: (value: number) => void;
  readOnly?: boolean;
}

export function FaturaValoresSection({
  formState,
  localTotalFatura,
  setLocalTotalFatura,
  localFaturaConcessionaria,
  setLocalFaturaConcessionaria,
  localIluminacaoPublica,
  setLocalIluminacaoPublica,
  localOutrosValores,
  setLocalOutrosValores,
  readOnly = false
}: FaturaValoresSectionProps) {
  const [displayTotalFatura, setDisplayTotalFatura] = useState<string>(
    localTotalFatura.toFixed(2).replace('.', ',')
  );
  const [displayFaturaConcessionaria, setDisplayFaturaConcessionaria] = useState<string>(
    localFaturaConcessionaria.toFixed(2).replace('.', ',')
  );
  const [displayIluminacaoPublica, setDisplayIluminacaoPublica] = useState<string>(
    localIluminacaoPublica.toFixed(2).replace('.', ',')
  );
  const [displayOutrosValores, setDisplayOutrosValores] = useState<string>(
    localOutrosValores.toFixed(2).replace('.', ',')
  );

  // Atualizar exibições quando os valores locais mudarem
  useEffect(() => {
    setDisplayTotalFatura(localTotalFatura.toFixed(2).replace('.', ','));
  }, [localTotalFatura]);

  useEffect(() => {
    setDisplayFaturaConcessionaria(localFaturaConcessionaria.toFixed(2).replace('.', ','));
  }, [localFaturaConcessionaria]);

  useEffect(() => {
    setDisplayIluminacaoPublica(localIluminacaoPublica.toFixed(2).replace('.', ','));
  }, [localIluminacaoPublica]);

  useEffect(() => {
    setDisplayOutrosValores(localOutrosValores.toFixed(2).replace('.', ','));
  }, [localOutrosValores]);

  // Função para converter string formatada para número
  const parseValue = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').trim();
    return parseFloat(cleanValue.replace(',', '.'));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Valores da Fatura</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Fatura */}
        <FormItem>
          <FormLabel>Total Fatura</FormLabel>
          <FormControl>
            <CurrencyInput
              value={displayTotalFatura}
              onValueChange={(value) => {
                setDisplayTotalFatura(value);
                setLocalTotalFatura(parseValue(value));
              }}
              placeholder="0,00"
              disabled={readOnly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Fatura Concessionária */}
        <FormItem>
          <FormLabel>Fatura Concessionária</FormLabel>
          <FormControl>
            <CurrencyInput
              value={displayFaturaConcessionaria}
              onValueChange={(value) => {
                setDisplayFaturaConcessionaria(value);
                setLocalFaturaConcessionaria(parseValue(value));
              }}
              placeholder="0,00"
              disabled={readOnly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Iluminação Pública */}
        <FormItem>
          <FormLabel>Iluminação Pública</FormLabel>
          <FormControl>
            <CurrencyInput
              value={displayIluminacaoPublica}
              onValueChange={(value) => {
                setDisplayIluminacaoPublica(value);
                setLocalIluminacaoPublica(parseValue(value));
              }}
              placeholder="0,00"
              disabled={readOnly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Outros Valores */}
        <FormItem>
          <FormLabel>Outros Valores</FormLabel>
          <FormControl>
            <CurrencyInput
              value={displayOutrosValores}
              onValueChange={(value) => {
                setDisplayOutrosValores(value);
                setLocalOutrosValores(parseValue(value));
              }}
              placeholder="0,00"
              disabled={readOnly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  );
}
