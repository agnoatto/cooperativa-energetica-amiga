
import { supabase } from "@/integrations/supabase/client";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Database } from "@/integrations/supabase/types";

export interface UpdateFaturaStatusInput {
  id: string;
  status: FaturaStatus;
  observacao?: string;
}

export const updateFaturaStatus = async ({
  id,
  status
}: UpdateFaturaStatusInput): Promise<Fatura> => {
  console.log('Iniciando atualização de status:', { id, status });

  // Atualizar status da fatura
  const { data: updatedFatura, error: updateError } = await supabase
    .from("faturas")
    .update({
      status: status,
      data_envio: status === 'enviada' ? new Date().toISOString() : undefined,
      data_atualizacao: new Date().toISOString()
    })
    .eq('id', id)
    .select('*, unidade_beneficiaria (*)')
    .single();

  if (updateError) {
    console.error('Erro ao atualizar fatura:', updateError);
    throw new Error(`Erro ao atualizar fatura: ${updateError.message}`);
  }

  if (!updatedFatura) {
    console.error('Fatura não foi atualizada');
    throw new Error('Fatura não foi atualizada');
  }

  console.log('Fatura atualizada com sucesso:', updatedFatura);
  return updatedFatura as unknown as Fatura;
};
