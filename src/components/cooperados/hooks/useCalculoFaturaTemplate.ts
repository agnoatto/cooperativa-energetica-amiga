
/**
 * Hook para gerenciar o template de cálculo de fatura
 * 
 * Este hook busca o template padrão para cálculo de fatura
 * e o configura no formulário quando necessário.
 */

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { UnidadeBeneficiariaFormValues } from "../types";

export function useCalculoFaturaTemplate(
  form: UseFormReturn<UnidadeBeneficiariaFormValues>,
  unidadeId?: string
) {
  // Carrega o template padrão para novas unidades
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
  }, [unidadeId, form]);
}
