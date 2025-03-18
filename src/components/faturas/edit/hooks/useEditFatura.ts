
/**
 * Hook personalizado para gerenciar o estado e a lógica do modal de edição de faturas
 * 
 * Este hook encapsula toda a lógica de estado, cálculo e manipulação de arquivos
 * relacionados à edição de faturas, simplificando o componente principal.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { calculateValues } from "../../utils/calculateValues";
import { getUnidadePercentualDesconto } from "../../utils/templateQueries";
import { editFaturaSchema } from "../schema";
import { convertUTCToLocal } from "@/utils/dateFormatters";

export function useEditFatura(fatura: any, onSave: (data: any) => Promise<void>, refetchFaturas?: () => void) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [arquivoInfo, setArquivoInfo] = useState({
    nome: fatura?.arquivo_concessionaria_nome || null,
    path: fatura?.arquivo_concessionaria_path || null,
    tipo: fatura?.arquivo_concessionaria_tipo || null,
    tamanho: fatura?.arquivo_concessionaria_tamanho || null
  });
  
  // Usando números para todos os valores monetários
  const [localTotalFatura, setLocalTotalFatura] = useState(Number(fatura?.total_fatura) || 0);
  const [localIluminacaoPublica, setLocalIluminacaoPublica] = useState(Number(fatura?.iluminacao_publica) || 0);
  const [localOutrosValores, setLocalOutrosValores] = useState(Number(fatura?.outros_valores) || 0);
  const [localFaturaConcessionaria, setLocalFaturaConcessionaria] = useState(Number(fatura?.fatura_concessionaria) || 0);
  const [localValorDesconto, setLocalValorDesconto] = useState(Number(fatura?.valor_desconto) || 0);
  const [localValorAssinatura, setLocalValorAssinatura] = useState(Number(fatura?.valor_assinatura) || 0);
  
  // Inicializar o formulário com react-hook-form
  const formState = useForm({
    resolver: zodResolver(editFaturaSchema),
    defaultValues: {
      consumo_kwh: fatura?.consumo_kwh.toString() || "0",
      data_vencimento: fatura?.data_vencimento ? convertUTCToLocal(fatura.data_vencimento) : "",
      data_proxima_leitura: fatura?.data_proxima_leitura ? convertUTCToLocal(fatura.data_proxima_leitura) : "",
      economia_acumulada: fatura?.economia_acumulada.toString() || "0",
      saldo_energia_kwh: fatura?.saldo_energia_kwh.toString() || "0",
      observacao: fatura?.observacao || "",
    },
    mode: "onChange",
  });

  // Atualizar o estado quando a fatura mudar
  useEffect(() => {
    if (fatura) {
      setArquivoInfo({
        nome: fatura.arquivo_concessionaria_nome || null,
        path: fatura.arquivo_concessionaria_path || null,
        tipo: fatura.arquivo_concessionaria_tipo || null,
        tamanho: fatura.arquivo_concessionaria_tamanho || null
      });
      
      // Inicializar valores com conversão para Number
      setLocalTotalFatura(Number(fatura.total_fatura) || 0);
      setLocalIluminacaoPublica(Number(fatura.iluminacao_publica) || 0);
      setLocalOutrosValores(Number(fatura.outros_valores) || 0);
      setLocalFaturaConcessionaria(Number(fatura.fatura_concessionaria) || 0);
      setLocalValorDesconto(Number(fatura.valor_desconto) || 0);
      setLocalValorAssinatura(Number(fatura.valor_assinatura) || 0);
      
      // Resetar formulário
      formState.reset({
        consumo_kwh: fatura.consumo_kwh.toString() || "0",
        data_vencimento: fatura.data_vencimento ? convertUTCToLocal(fatura.data_vencimento) : "",
        data_proxima_leitura: fatura.data_proxima_leitura ? convertUTCToLocal(fatura.data_proxima_leitura) : "",
        economia_acumulada: fatura.economia_acumulada.toString() || "0",
        saldo_energia_kwh: fatura.saldo_energia_kwh.toString() || "0",
        observacao: fatura.observacao || "",
      });
    }
  }, [fatura, formState]);

  // Função para calcular valores com base nos dados atuais
  const handleCalcularClick = async () => {
    if (!fatura) return;
    
    setIsCalculating(true);
    try {
      console.log("[useEditFatura] Valores antes do cálculo:", {
        totalFatura: localTotalFatura,
        iluminacaoPublica: localIluminacaoPublica,
        outrosValores: localOutrosValores,
        faturaConcessionaria: localFaturaConcessionaria
      });
      
      // Buscar percentual de desconto da unidade
      const { percentualDesconto, error } = 
        await getUnidadePercentualDesconto(fatura.unidade_beneficiaria.id);
      
      if (error) throw error;
      
      console.log("[useEditFatura] Percentual de desconto da unidade:", percentualDesconto);
      
      // Calcula os valores usando números diretamente
      const valores = await calculateValues({
        totalFatura: localTotalFatura,
        iluminacaoPublica: localIluminacaoPublica,
        outrosValores: localOutrosValores,
        faturaConcessionaria: localFaturaConcessionaria,
        percentualDesconto: percentualDesconto,
        unidadeBeneficiariaId: fatura.unidade_beneficiaria.id
      });
      
      console.log("[useEditFatura] Valores calculados:", valores);
      
      // Define os valores calculados como números
      setLocalValorDesconto(valores.valorDesconto);
      setLocalValorAssinatura(valores.valorAssinatura);
    } catch (error) {
      console.error('Erro ao calcular valores:', error);
      toast.error('Erro ao calcular valores. Verifique o console para mais detalhes.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Função para atualizar informações do arquivo
  const handleFileChange = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log("[useEditFatura] Atualizando arquivo:", { nome, path, tipo, tamanho });
    setArquivoInfo({
      nome,
      path,
      tipo,
      tamanho
    });
    
    if (refetchFaturas) {
      console.log("[useEditFatura] Chamando refetchFaturas após alteração de arquivo");
      setTimeout(() => refetchFaturas(), 100);
    }
  };

  // Função para submeter o formulário
  const handleSubmit = async (values: any) => {
    console.log("[useEditFatura] Submetendo formulário com valores:", {
      localValorAssinatura,
      localValorDesconto,
      localTotalFatura,
      localFaturaConcessionaria,
      localIluminacaoPublica,
      localOutrosValores,
      values
    });
    
    const data = {
      id: fatura.id,
      consumo_kwh: Number(values.consumo_kwh),
      valor_assinatura: localValorAssinatura,
      data_vencimento: values.data_vencimento,
      data_proxima_leitura: values.data_proxima_leitura || null,
      fatura_concessionaria: localFaturaConcessionaria,
      total_fatura: localTotalFatura,
      iluminacao_publica: localIluminacaoPublica,
      outros_valores: localOutrosValores,
      valor_desconto: localValorDesconto,
      economia_acumulada: Number(values.economia_acumulada),
      saldo_energia_kwh: Number(values.saldo_energia_kwh),
      observacao: values.observacao,
      arquivo_concessionaria_nome: arquivoInfo.nome,
      arquivo_concessionaria_path: arquivoInfo.path,
      arquivo_concessionaria_tipo: arquivoInfo.tipo,
      arquivo_concessionaria_tamanho: arquivoInfo.tamanho
    };

    console.log("[useEditFatura] Dados finais para salvar:", data);
    await onSave(data);
  };

  return {
    formState,
    isCalculating,
    localTotalFatura,
    setLocalTotalFatura,
    localIluminacaoPublica,
    setLocalIluminacaoPublica,
    localOutrosValores,
    setLocalOutrosValores,
    localFaturaConcessionaria,
    setLocalFaturaConcessionaria,
    localValorDesconto,
    setLocalValorDesconto,
    localValorAssinatura,
    setLocalValorAssinatura,
    arquivoInfo,
    handleFileChange,
    handleCalcularClick,
    handleSubmit
  };
}
