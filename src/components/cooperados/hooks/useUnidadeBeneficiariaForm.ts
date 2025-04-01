
/**
 * Hook para gerenciar o formulário de unidades beneficiárias
 * 
 * Este hook implementa a lógica de carregamento, validação e submissão do formulário
 * de unidades beneficiárias, permitindo tanto a criação quanto a edição.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { unidadeBeneficiariaFormSchema } from "../schema";
import { UnidadeBeneficiariaFormValues } from "../types";

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
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [originalCooperadoId, setOriginalCooperadoId] = useState<string | null>(null);

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

  // Inicializar o selectedCooperadoId com cooperadoId quando o componente monta
  useEffect(() => {
    if (cooperadoId) {
      setSelectedCooperadoId(cooperadoId);
    }
  }, [cooperadoId]);

  // Carregar lista de cooperados apenas uma vez
  useEffect(() => {
    let isMounted = true;

    const fetchCooperados = async () => {
      try {
        const { data, error } = await supabase
          .from('cooperados')
          .select('id, nome')
          .is('data_exclusao', null)
          .order('nome');

        if (error) throw error;
        if (isMounted) {
          setCooperados(data || []);
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error("Erro ao carregar cooperados: " + error.message);
        }
      }
    };

    fetchCooperados();

    return () => {
      isMounted = false;
    };
  }, []); // Executar apenas uma vez na montagem

  // Carregar o template padrão para novas unidades
  useEffect(() => {
    if (!unidadeId) {
      const fetchDefaultTemplate = async () => {
        try {
          const { data, error } = await supabase.rpc('get_default_calculo_fatura_template');
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            form.setValue('calculo_fatura_template_id', data[0].id);
          }
        } catch (error: any) {
          console.error("Erro ao buscar template padrão:", error);
        }
      };
      
      fetchDefaultTemplate();
    }
  }, [unidadeId]);

  // Carregar dados da unidade quando unidadeId mudar
  useEffect(() => {
    let isMounted = true;

    const fetchUnidade = async () => {
      if (!unidadeId) return;

      try {
        const { data, error } = await supabase
          .from('unidades_beneficiarias')
          .select('*')
          .eq('id', unidadeId)
          .single();

        if (error) throw error;

        if (data && isMounted) {
          // Armazenar o cooperado_id original para referência
          setOriginalCooperadoId(data.cooperado_id);
          setSelectedCooperadoId(data.cooperado_id);
          
          form.reset({
            numero_uc: data.numero_uc,
            apelido: data.apelido || "",
            cep: data.cep || "",
            logradouro: data.logradouro || "",
            numero: data.numero || "",
            complemento: data.complemento || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            uf: (data.uf as any) || undefined,
            // Convertendo números para strings
            percentual_desconto: data.percentual_desconto !== null ? data.percentual_desconto.toString() : "",
            consumo_kwh: data.consumo_kwh !== null ? data.consumo_kwh.toString() : "",
            data_entrada: new Date(data.data_entrada).toISOString().split('T')[0],
            data_saida: data.data_saida ? new Date(data.data_saida).toISOString().split('T')[0] : "",
            possui_geracao_propria: data.possui_geracao_propria || false,
            potencia_instalada: data.potencia_instalada,
            data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString().split('T')[0] : null,
            observacao_geracao: data.observacao_geracao,
            recebe_creditos_proprios: data.recebe_creditos_proprios || false,
            uc_origem_creditos: data.uc_origem_creditos,
            data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString().split('T')[0] : null,
            observacao_creditos: data.observacao_creditos,
            calculo_fatura_template_id: data.calculo_fatura_template_id || "",
          });
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error("Erro ao carregar dados da unidade: " + error.message);
        }
      }
    };

    fetchUnidade();

    return () => {
      isMounted = false;
    };
  }, [unidadeId]); 

  const fetchCep = async (cep: string) => {
    try {
      setIsLoadingCep(true);
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: any = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      form.setValue('logradouro', data.logradouro);
      form.setValue('bairro', data.bairro);
      form.setValue('cidade', data.localidade);
      form.setValue('uf', data.uf as any);
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const onSubmit = async (data: UnidadeBeneficiariaFormValues) => {
    if (!selectedCooperadoId) {
      toast.error("Selecione um cooperado");
      return;
    }

    try {
      const endereco = `${data.logradouro}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ''} - ${data.bairro}, ${data.cidade} - ${data.uf}, ${data.cep}`;
      
      const unidadeData = {
        cooperado_id: selectedCooperadoId,
        numero_uc: data.numero_uc,
        apelido: data.apelido || null,
        endereco: endereco,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        cep: data.cep,
        // Convertendo strings para números no momento de salvar
        consumo_kwh: data.consumo_kwh ? parseFloat(data.consumo_kwh) : null,
        percentual_desconto: parseFloat(data.percentual_desconto),
        data_entrada: new Date(data.data_entrada).toISOString(),
        data_saida: data.data_saida ? new Date(data.data_saida).toISOString() : null,
        possui_geracao_propria: data.possui_geracao_propria,
        potencia_instalada: data.potencia_instalada,
        data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString() : null,
        observacao_geracao: data.observacao_geracao,
        recebe_creditos_proprios: data.recebe_creditos_proprios,
        uc_origem_creditos: data.uc_origem_creditos,
        data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString() : null,
        observacao_creditos: data.observacao_creditos,
        calculo_fatura_template_id: data.calculo_fatura_template_id || null,
      };

      console.log("Dados da unidade para salvar:", unidadeData);

      if (unidadeId) {
        // Verificar se houve mudança de cooperado
        const cooperadoMudou = originalCooperadoId !== selectedCooperadoId;
        
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .update(unidadeData)
          .eq('id', unidadeId);

        if (error) throw error;
        
        if (cooperadoMudou) {
          toast.success("Unidade beneficiária transferida para outro cooperado com sucesso!");
        } else {
          toast.success("Unidade beneficiária atualizada com sucesso!");
        }
      } else {
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .insert(unidadeData);

        if (error) throw error;
        toast.success("Unidade beneficiária cadastrada com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(`Erro ao ${unidadeId ? 'atualizar' : 'cadastrar'} unidade beneficiária: ` + error.message);
    }
  };

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
