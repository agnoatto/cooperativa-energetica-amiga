
/**
 * Hook para gerenciar o formulário de unidades beneficiárias
 * 
 * Este hook centraliza a lógica de formulário para unidades beneficiárias,
 * utilizando hooks específicos para cada responsabilidade.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unidadeBeneficiariaFormSchema } from "../schema";
import { UnidadeBeneficiariaFormValues } from "../types";
import { useCooperados } from "./useCooperados";
import { useCepFetch } from "./useCepFetch";
import { useCalculoFaturaTemplate } from "./useCalculoFaturaTemplate";
import { useUnidadeData } from "./useUnidadeData";
import { useUnidadeFormSubmit } from "./useUnidadeFormSubmit";

interface UseUnidadeBeneficiariaFormProps {
  cooperadoId?: string;
  unidadeId?: string;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useUnidadeBeneficiariaForm({
  cooperadoId,
  unidadeId,
  onSuccess,
  onOpenChange,
}: UseUnidadeBeneficiariaFormProps) {
  // Inicializar o formulário
  const form = useForm<UnidadeBeneficiariaFormValues>({
    resolver: zodResolver(unidadeBeneficiariaFormSchema),
    defaultValues: {
      numero_uc: "",
      apelido: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: undefined,
      // Campos convertidos para string
      consumo_kwh: "",
      percentual_desconto: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_saida: "",
      possui_geracao_propria: false,
      potencia_instalada: null,
      data_inicio_geracao: null,
      observacao_geracao: null,
      recebe_creditos_proprios: false,
      uc_origem_creditos: null,
      data_inicio_creditos: null,
      observacao_creditos: null,
      calculo_fatura_template_id: "",
    },
  });

  // Usar os hooks específicos
  const { cooperados } = useCooperados();
  const { fetchCep, isLoadingCep } = useCepFetch(form);
  const { selectedCooperadoId, setSelectedCooperadoId, originalCooperadoId } = useUnidadeData(form, unidadeId);
  const { onSubmit } = useUnidadeFormSubmit({ 
    unidadeId, 
    selectedCooperadoId, 
    originalCooperadoId, 
    onSuccess, 
    onOpenChange 
  });

  // Carregar o template de cálculo
  useCalculoFaturaTemplate(form, unidadeId);

  // Inicializar o selectedCooperadoId com cooperadoId quando o componente monta
  useEffect(() => {
    if (cooperadoId) {
      setSelectedCooperadoId(cooperadoId);
    }
  }, [cooperadoId, setSelectedCooperadoId]);

  return {
    form,
    isLoadingCep,
    cooperados,
    selectedCooperadoId,
    setSelectedCooperadoId,
    fetchCep,
    onSubmit,
  };
}
