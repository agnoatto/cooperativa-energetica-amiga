
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { calculateValues } from "../utils/calculateValues";

// Seções do formulário
import { DateSection } from "./sections/DateSection";
import { ConsumoSection } from "./sections/ConsumoSection";
import { ValoresBasicosSection } from "./sections/ValoresBasicosSection";
import { ValoresAdicionaisSection } from "./sections/ValoresAdicionaisSection";
import { ObservacaoSection } from "./sections/ObservacaoSection";
import { ArquivoSection } from "./sections/ArquivoSection";
import { FormErrorsSection } from "./sections/FormErrorsSection";

interface FaturaEditFormProps {
  faturaId: string;
  consumo: string;
  setConsumo: (value: string) => void;
  totalFatura: string;
  setTotalFatura: (value: string) => void;
  faturaConcessionaria: string;
  setFaturaConcessionaria: (value: string) => void;
  iluminacaoPublica: string;
  setIluminacaoPublica: (value: string) => void;
  outrosValores: string;
  setOutrosValores: (value: string) => void;
  saldoEnergiaKwh: string;
  setSaldoEnergiaKwh: (value: string) => void;
  observacao: string;
  setObservacao: (value: string) => void;
  dataVencimento: string;
  setDataVencimento: (value: string) => void;
  arquivoConcessionariaNome: string | null | undefined;
  setArquivoConcessionariaNome: (value: string | null) => void;
  arquivoConcessionariaPath: string | null | undefined;
  setArquivoConcessionariaPath: (value: string | null) => void;
  arquivoConcessionariaTipo?: string | null | undefined;
  setArquivoConcessionariaTipo?: (value: string | null) => void;
  arquivoConcessionariaTamanho?: number | null | undefined;
  setArquivoConcessionariaTamanho?: (value: number | null) => void;
  percentualDesconto: number;
  onSuccess: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  formErrors: Record<string, string>;
}

export function FaturaEditForm({
  faturaId,
  consumo,
  setConsumo,
  totalFatura,
  setTotalFatura,
  faturaConcessionaria,
  setFaturaConcessionaria,
  iluminacaoPublica,
  setIluminacaoPublica,
  outrosValores,
  setOutrosValores,
  saldoEnergiaKwh,
  setSaldoEnergiaKwh,
  observacao,
  setObservacao,
  dataVencimento,
  setDataVencimento,
  arquivoConcessionariaNome,
  setArquivoConcessionariaNome,
  arquivoConcessionariaPath,
  setArquivoConcessionariaPath,
  arquivoConcessionariaTipo,
  setArquivoConcessionariaTipo,
  arquivoConcessionariaTamanho,
  setArquivoConcessionariaTamanho,
  percentualDesconto,
  onSuccess,
  onSubmit,
  onFileChange,
  formErrors,
}: FaturaEditFormProps) {
  const queryClient = useQueryClient();
  const [valorAssinatura, setValorAssinatura] = useState("0");

  // Calcula o valor da assinatura sempre que os valores relevantes mudarem
  useEffect(() => {
    console.log('[FaturaEditForm] Recalculando valores com:', {
      totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria
    });

    try {
      const calculatedValues = calculateValues(
        totalFatura || "0",
        iluminacaoPublica || "0",
        outrosValores || "0",
        faturaConcessionaria || "0",
        percentualDesconto
      );
      
      // Formata o valor calculado para exibição
      setValorAssinatura(formatCurrency(calculatedValues.valor_assinatura));
      console.log('[FaturaEditForm] Valor da assinatura calculado:', calculatedValues.valor_assinatura);
    } catch (error) {
      console.error('[FaturaEditForm] Erro ao calcular valor da assinatura:', error);
      setValorAssinatura("Erro no cálculo");
    }
  }, [totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto]);

  // Handler para atualização de arquivo
  const handleFileUpdateSuccess = () => {
    onSuccess({
      id: faturaId,
      arquivo_concessionaria_nome: arquivoConcessionariaNome,
      arquivo_concessionaria_path: arquivoConcessionariaPath,
      arquivo_concessionaria_tipo: arquivoConcessionariaTipo,
      arquivo_concessionaria_tamanho: arquivoConcessionariaTamanho
    });
    
    // Recarregar dados das faturas para atualizar a interface
    queryClient.invalidateQueries({
      queryKey: ['faturas']
    });
  };

  // Handler para mudança de arquivo
  const handleFileChangeInternal = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    // Função para atualizar o estado local quando o arquivo é adicionado ou removido
    onFileChange(nome, path, tipo, tamanho);
    
    // Invalidar cache para forçar atualização
    queryClient.invalidateQueries({
      queryKey: ['faturas']
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <DateSection 
        dataVencimento={dataVencimento}
        setDataVencimento={setDataVencimento}
        error={formErrors.dataVencimento}
      />

      <ConsumoSection 
        consumo={consumo}
        setConsumo={setConsumo}
        error={formErrors.consumo}
      />

      <ValoresBasicosSection 
        totalFatura={totalFatura}
        setTotalFatura={setTotalFatura}
        faturaConcessionaria={faturaConcessionaria}
        setFaturaConcessionaria={setFaturaConcessionaria}
        valorAssinatura={valorAssinatura}
        errorTotal={formErrors.totalFatura}
        errorFatura={formErrors.faturaConcessionaria}
      />

      <ValoresAdicionaisSection 
        iluminacaoPublica={iluminacaoPublica}
        setIluminacaoPublica={setIluminacaoPublica}
        outrosValores={outrosValores}
        setOutrosValores={setOutrosValores}
        saldoEnergiaKwh={saldoEnergiaKwh}
        setSaldoEnergiaKwh={setSaldoEnergiaKwh}
      />

      <ObservacaoSection 
        observacao={observacao}
        setObservacao={setObservacao}
      />
      
      <ArquivoSection 
        faturaId={faturaId}
        arquivoConcessionariaNome={arquivoConcessionariaNome}
        arquivoConcessionariaPath={arquivoConcessionariaPath}
        arquivoConcessionariaTipo={arquivoConcessionariaTipo}
        arquivoConcessionariaTamanho={arquivoConcessionariaTamanho}
        onSuccess={handleFileUpdateSuccess}
        onFileChange={handleFileChangeInternal}
      />

      <FormErrorsSection errors={formErrors} />
    </form>
  );
}
