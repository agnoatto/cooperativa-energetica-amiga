
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usinaFormSchema, type UsinaFormData } from "../schema";

interface UseUsinaFormProps {
  usinaId?: string;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: UsinaFormData = {
  investidor_id: "",
  unidade_usina_id: "",
  valor_kwh: 0,
  potencia_instalada: undefined,
  data_inicio: undefined,
  dados_pagamento_nome: "",
  dados_pagamento_documento: "",
  dados_pagamento_banco: "",
  dados_pagamento_agencia: "",
  dados_pagamento_conta: "",
  dados_pagamento_telefone: "",
  dados_pagamento_email: "",
  dados_pagamento_chave_pix: "",
  dados_pagamento_tipo_chave_pix: undefined,
};

export function useUsinaForm({ usinaId, onSuccess, onOpenChange }: UseUsinaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  const form = useForm<UsinaFormData>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const fetchUsinaData = async (open: boolean) => {
    if (!open || (open && !usinaId)) {
      form.reset(defaultValues);
      setStatus('active');
      return;
    }

    if (usinaId && open) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("usinas")
          .select("*")
          .eq("id", usinaId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          const tipoPix = data.dados_pagamento_tipo_chave_pix as UsinaFormData['dados_pagamento_tipo_chave_pix'];
          const usinaStatus = data.status === 'draft' ? 'draft' : 'active';
          setStatus(usinaStatus);
          
          form.reset({
            investidor_id: data.investidor_id,
            unidade_usina_id: data.unidade_usina_id,
            valor_kwh: Number(data.valor_kwh),
            potencia_instalada: data.potencia_instalada ? Number(data.potencia_instalada) : undefined,
            data_inicio: data.data_inicio ? new Date(data.data_inicio) : undefined,
            dados_pagamento_nome: data.dados_pagamento_nome || "",
            dados_pagamento_documento: data.dados_pagamento_documento || "",
            dados_pagamento_banco: data.dados_pagamento_banco || "",
            dados_pagamento_agencia: data.dados_pagamento_agencia || "",
            dados_pagamento_conta: data.dados_pagamento_conta || "",
            dados_pagamento_telefone: data.dados_pagamento_telefone || "",
            dados_pagamento_email: data.dados_pagamento_email || "",
            dados_pagamento_chave_pix: data.dados_pagamento_chave_pix || "",
            dados_pagamento_tipo_chave_pix: tipoPix,
          });
        }
      } catch (error) {
        console.error("Error fetching usina:", error);
        toast.error("Erro ao carregar dados da usina");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = async (data: UsinaFormData) => {
    setIsLoading(true);
    try {
      const usinaData = {
        investidor_id: data.investidor_id,
        unidade_usina_id: data.unidade_usina_id,
        valor_kwh: data.valor_kwh,
        potencia_instalada: data.potencia_instalada,
        data_inicio: data.data_inicio ? data.data_inicio.toISOString().split('T')[0] : null,
        dados_pagamento_nome: data.dados_pagamento_nome,
        dados_pagamento_documento: data.dados_pagamento_documento,
        dados_pagamento_banco: data.dados_pagamento_banco,
        dados_pagamento_agencia: data.dados_pagamento_agencia,
        dados_pagamento_conta: data.dados_pagamento_conta,
        dados_pagamento_telefone: data.dados_pagamento_telefone,
        dados_pagamento_email: data.dados_pagamento_email,
        dados_pagamento_chave_pix: data.dados_pagamento_chave_pix,
        dados_pagamento_tipo_chave_pix: data.dados_pagamento_tipo_chave_pix,
        status,
      };

      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update(usinaData)
          .eq("id", usinaId);

        if (error) {
          console.error("Error updating usina:", error);
          throw error;
        }
        toast.success("Usina atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("usinas")
          .insert([usinaData]);

        if (error) {
          console.error("Error creating usina:", error);
          throw error;
        }
        toast.success("Usina cadastrada com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving usina:", error);
      toast.error(error.message || "Erro ao salvar usina");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    fetchUsinaData,
    status,
    setStatus,
  };
}
