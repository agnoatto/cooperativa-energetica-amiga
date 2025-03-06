
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "../../CurrencyInput";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/formatters";

interface ValoresBasicosSectionProps {
  totalFatura: string;
  setTotalFatura: (value: string) => void;
  faturaConcessionaria: string;
  setFaturaConcessionaria: (value: string) => void;
  valorAssinatura: string;
  errorTotal?: string;
  errorFatura?: string;
}

export function ValoresBasicosSection({
  totalFatura,
  setTotalFatura,
  faturaConcessionaria,
  setFaturaConcessionaria,
  valorAssinatura,
  errorTotal,
  errorFatura
}: ValoresBasicosSectionProps) {
  // Formatação para exibição
  const [totalFaturaFormatado, setTotalFaturaFormatado] = useState("");
  const [faturaConcessionariaFormatada, setFaturaConcessionariaFormatada] = useState("");

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

    setTotalFaturaFormatado(formatarParaExibicao(totalFatura));
    setFaturaConcessionariaFormatada(formatarParaExibicao(faturaConcessionaria));
  }, [totalFatura, faturaConcessionaria]);

  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="totalFatura" className="font-semibold">
          Valor Total Sem Assinatura *
        </Label>
        <CurrencyInput
          id="totalFatura"
          value={totalFaturaFormatado}
          onChange={setTotalFatura}
          required
          decimalScale={2}
          className={errorTotal ? 'border-red-500' : ''}
        />
        {errorTotal && (
          <span className="text-sm text-red-500">{errorTotal}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="faturaConcessionaria" className="font-semibold">
          Valor Conta de Energia *
        </Label>
        <CurrencyInput
          id="faturaConcessionaria"
          value={faturaConcessionariaFormatada}
          onChange={setFaturaConcessionaria}
          required
          decimalScale={2}
          className={errorFatura ? 'border-red-500' : ''}
        />
        {errorFatura && (
          <span className="text-sm text-red-500">{errorFatura}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="valorAssinatura" className="font-semibold">
          Valor da Assinatura (Calculado)
        </Label>
        <Input
          id="valorAssinatura"
          value={valorAssinatura}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </>
  );
}
