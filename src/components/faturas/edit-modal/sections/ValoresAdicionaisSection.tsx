
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "../../CurrencyInput";
import { useState, useEffect } from "react";

interface ValoresAdicionaisSectionProps {
  iluminacaoPublica: string;
  setIluminacaoPublica: (value: string) => void;
  outrosValores: string;
  setOutrosValores: (value: string) => void;
  saldoEnergiaKwh: string;
  setSaldoEnergiaKwh: (value: string) => void;
}

export function ValoresAdicionaisSection({
  iluminacaoPublica,
  setIluminacaoPublica,
  outrosValores,
  setOutrosValores,
  saldoEnergiaKwh,
  setSaldoEnergiaKwh
}: ValoresAdicionaisSectionProps) {
  // Formatação para exibição
  const [iluminacaoPublicaFormatada, setIluminacaoPublicaFormatada] = useState("");
  const [outrosValoresFormatados, setOutrosValoresFormatados] = useState("");

  // Atualizar as versões formatadas quando os valores mudarem
  useEffect(() => {
    // Para exibição no CurrencyInput, formatamos o valor para o padrão brasileiro
    const formatarParaExibicao = (valor: string) => {
      // Se for uma string vazia ou 0, retorna string vazia
      if (!valor || valor === "0") return "";
      
      // Converte para número e formata
      const numero = Number(valor);
      if (isNaN(numero)) return "";
      
      return numero.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    };

    setIluminacaoPublicaFormatada(formatarParaExibicao(iluminacaoPublica));
    setOutrosValoresFormatados(formatarParaExibicao(outrosValores));
  }, [iluminacaoPublica, outrosValores]);

  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="iluminacaoPublica" className="font-semibold">
          Iluminação Pública *
        </Label>
        <CurrencyInput
          id="iluminacaoPublica"
          value={iluminacaoPublicaFormatada}
          onChange={setIluminacaoPublica}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="outrosValores" className="font-semibold">
          Outros Valores *
        </Label>
        <CurrencyInput
          id="outrosValores"
          value={outrosValoresFormatados}
          onChange={setOutrosValores}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="saldoEnergiaKwh" className="font-semibold">
          Saldo de Energia (kWh) *
        </Label>
        <Input
          type="number"
          id="saldoEnergiaKwh"
          value={saldoEnergiaKwh}
          onChange={(e) => setSaldoEnergiaKwh(e.target.value)}
          step="0.01"
          min="0"
          required
        />
      </div>
    </>
  );
}
