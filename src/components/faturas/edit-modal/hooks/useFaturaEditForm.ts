
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { convertUTCToLocal, convertLocalToUTC } from "@/utils/dateFormatters";
import { parseValue } from "../../utils/calculateValues";

export interface FaturaFormState {
  consumo: string;
  totalFatura: string;
  faturaConcessionaria: string;
  iluminacaoPublica: string;
  outrosValores: string;
  saldoEnergiaKwh: string;
  observacao: string;
  dataVencimento: string;
  arquivoConcessionariaNome: string | null;
  arquivoConcessionariaPath: string | null;
  arquivoConcessionariaTipo: string | null;
  arquivoConcessionariaTamanho: number | null;
}

// Modificando a interface para ser atribuível a Record<string, string>
export interface FaturaFormErrors {
  [key: string]: string; // Adicionando index signature
  dataVencimento?: string;
  consumo?: string;
  totalFatura?: string;
  faturaConcessionaria?: string;
}

interface UseFaturaEditFormProps {
  fatura: {
    id: string;
    consumo_kwh: number | null;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    saldo_energia_kwh: number | null;
    observacao: string | null;
    data_vencimento: string;
    arquivo_concessionaria_nome?: string | null;
    arquivo_concessionaria_path?: string | null;
    arquivo_concessionaria_tipo?: string | null;
    arquivo_concessionaria_tamanho?: number | null;
    unidade_beneficiaria: {
      percentual_desconto: number;
    };
  };
  onSuccess: (data: any) => Promise<void>;
}

export function useFaturaEditForm({ fatura, onSuccess }: UseFaturaEditFormProps) {
  const [formState, setFormState] = useState<FaturaFormState>({
    consumo: fatura.consumo_kwh?.toString() || "0",
    totalFatura: fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    faturaConcessionaria: fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    iluminacaoPublica: fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    outrosValores: fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    saldoEnergiaKwh: fatura.saldo_energia_kwh?.toString() || "0",
    observacao: fatura.observacao || '',
    dataVencimento: convertUTCToLocal(fatura.data_vencimento),
    arquivoConcessionariaNome: fatura.arquivo_concessionaria_nome || null,
    arquivoConcessionariaPath: fatura.arquivo_concessionaria_path || null,
    arquivoConcessionariaTipo: fatura.arquivo_concessionaria_tipo || null,
    arquivoConcessionariaTamanho: fatura.arquivo_concessionaria_tamanho || null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FaturaFormErrors>({});

  // Atualizar o estado quando a fatura mudar
  useEffect(() => {
    setFormState({
      consumo: fatura.consumo_kwh?.toString() || "0",
      totalFatura: fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      faturaConcessionaria: fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      iluminacaoPublica: fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      outrosValores: fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      saldoEnergiaKwh: fatura.saldo_energia_kwh?.toString() || "0",
      observacao: fatura.observacao || '',
      dataVencimento: convertUTCToLocal(fatura.data_vencimento),
      arquivoConcessionariaNome: fatura.arquivo_concessionaria_nome || null,
      arquivoConcessionariaPath: fatura.arquivo_concessionaria_path || null,
      arquivoConcessionariaTipo: fatura.arquivo_concessionaria_tipo || null,
      arquivoConcessionariaTamanho: fatura.arquivo_concessionaria_tamanho || null,
    });
  }, [fatura]);

  const updateField = (field: keyof FaturaFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: FaturaFormErrors = {};

    if (!formState.dataVencimento) {
      errors.dataVencimento = 'Data de vencimento é obrigatória';
    }

    // Para consumo, validamos apenas se é um número positivo
    const consumoValue = Number(formState.consumo);
    if (isNaN(consumoValue) || consumoValue <= 0) {
      errors.consumo = 'Consumo deve ser maior que zero';
    }

    // Para valores monetários, usamos parseValue para validar
    if (parseValue(formState.totalFatura) <= 0) {
      errors.totalFatura = 'Valor total deve ser maior que zero';
    }

    if (parseValue(formState.faturaConcessionaria) <= 0) {
      errors.faturaConcessionaria = 'Valor da conta de energia deve ser maior que zero';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log('[useFaturaEditForm] Arquivo alterado:', { nome, path, tipo, tamanho });
    updateField('arquivoConcessionariaNome', nome);
    updateField('arquivoConcessionariaPath', path);
    updateField('arquivoConcessionariaTipo', tipo);
    updateField('arquivoConcessionariaTamanho', tamanho);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[useFaturaEditForm] Iniciando salvamento com dados:', formState);

      // Convertendo diretamente para número usando parseValue para valores monetários
      const updateData = {
        id: fatura.id,
        // Para consumo e saldo, usamos Number diretamente pois já são números
        consumo_kwh: Number(formState.consumo),
        saldo_energia_kwh: Number(formState.saldoEnergiaKwh),
        // Para valores monetários, usamos parseValue para converter do formato brasileiro
        total_fatura: parseValue(formState.totalFatura),
        fatura_concessionaria: parseValue(formState.faturaConcessionaria),
        iluminacao_publica: parseValue(formState.iluminacaoPublica),
        outros_valores: parseValue(formState.outrosValores),
        observacao: formState.observacao || null,
        data_vencimento: convertLocalToUTC(formState.dataVencimento),
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
        arquivo_concessionaria_nome: formState.arquivoConcessionariaNome,
        arquivo_concessionaria_path: formState.arquivoConcessionariaPath,
        arquivo_concessionaria_tipo: formState.arquivoConcessionariaTipo,
        arquivo_concessionaria_tamanho: formState.arquivoConcessionariaTamanho,
      };
      
      console.log('[useFaturaEditForm] Dados prontos para enviar:', updateData);
      
      await onSuccess(updateData);
      console.log('[useFaturaEditForm] Salvamento concluído com sucesso');
    } catch (error) {
      console.error('[useFaturaEditForm] Erro ao salvar:', error);
      toast.error('Erro ao salvar as alterações');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    updateField,
    isLoading,
    formErrors,
    handleFileChange,
    handleSubmit,
  };
}
