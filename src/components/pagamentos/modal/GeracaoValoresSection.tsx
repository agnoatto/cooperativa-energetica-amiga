
/**
 * Componente que gerencia os campos de geração e valores do pagamento
 * 
 * Este componente controla os campos de geração de energia (kWh), valor do kWh,
 * TUSD Fio B, e exibe os cálculos automáticos de valores derivados.
 */
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarMoeda } from "@/utils/formatters";

interface GeracaoValoresSectionProps {
  geracao: number;
  setGeracao: (value: number) => void;
  valorKwh: number;
  tusdFioB: number;
  setTusdFioB: (value: number) => void;
  valorTusdFioB: number;
  valorBruto: number;
  valorConcessionaria: number;
  setValorConcessionaria: (value: number) => void;
}

export function GeracaoValoresSection({
  geracao,
  setGeracao,
  valorKwh,
  tusdFioB,
  setTusdFioB,
  valorTusdFioB,
  valorBruto,
  valorConcessionaria,
  setValorConcessionaria
}: GeracaoValoresSectionProps) {
  return (
    <>
      {/* Geração */}
      <div className="space-y-2">
        <Label htmlFor="geracao">Geração (kWh)</Label>
        <Input
          id="geracao"
          type="number"
          step="0.01"
          min="0"
          value={geracao}
          onChange={(e) => setGeracao(parseFloat(e.target.value) || 0)}
          required
        />
      </div>
      
      {/* Valor kWh - Somente leitura */}
      <div className="space-y-2">
        <Label htmlFor="valorKwh">Valor do kWh (R$)</Label>
        <Input
          id="valorKwh"
          type="number"
          step="0.0001"
          min="0"
          value={valorKwh}
          readOnly
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>
      
      {/* TUSD Fio B */}
      <div className="space-y-2">
        <Label htmlFor="tusdFioB">TUSD Fio B (R$/kWh)</Label>
        <Input
          id="tusdFioB"
          type="number"
          step="0.0001"
          min="0"
          value={tusdFioB}
          onChange={(e) => setTusdFioB(parseFloat(e.target.value) || 0)}
          required
        />
      </div>
      
      {/* Valor TUSD Fio B Total */}
      <div className="space-y-2">
        <Label htmlFor="valorTusdFioB">Valor Total TUSD Fio B</Label>
        <Input
          id="valorTusdFioB"
          type="text"
          value={formatarMoeda(valorTusdFioB)}
          disabled
        />
      </div>
      
      {/* Valor Bruto */}
      <div className="space-y-2">
        <Label htmlFor="valorBruto">Valor Bruto (R$)</Label>
        <Input
          id="valorBruto"
          type="text"
          value={formatarMoeda(valorBruto)}
          disabled
        />
      </div>
      
      {/* Valor Concessionária */}
      <div className="space-y-2">
        <Label htmlFor="valorConcessionaria">Valor Concessionária (R$)</Label>
        <Input
          id="valorConcessionaria"
          type="number"
          step="0.01"
          min="0"
          value={valorConcessionaria}
          onChange={(e) => setValorConcessionaria(parseFloat(e.target.value) || 0)}
          required
        />
      </div>
    </>
  );
}
