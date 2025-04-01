
/**
 * Hook para gerenciar a busca de CEP
 * 
 * Este hook implementa a lógica de consulta de CEP utilizando a API ViaCEP
 * e atualiza os campos de endereço no formulário conforme os dados retornados.
 */

import { useState } from "react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { UnidadeBeneficiariaFormValues } from "../types";

export function useCepFetch(form: UseFormReturn<UnidadeBeneficiariaFormValues>) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

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

  return {
    isLoadingCep,
    fetchCep,
  };
}
