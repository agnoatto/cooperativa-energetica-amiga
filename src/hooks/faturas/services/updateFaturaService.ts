
import { supabase } from "@/integrations/supabase/client";
import { Fatura, FaturaStatus } from "@/types/fatura";

export interface UpdateFaturaStatusInput {
  id: string;
  status: FaturaStatus;
  observacao?: string;
}

export const updateFaturaStatus = async ({
  id,
  status,
  observacao
}: UpdateFaturaStatusInput): Promise<Fatura> => {
  console.log('Atualizando status da fatura:', { id, status });

  const { data: updatedFatura, error } = await supabase
    .from("faturas")
    .update({ 
      status,
      observacao,
      data_atualizacao: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) {
    console.error('Erro ao atualizar fatura:', error);
    throw new Error(`Erro ao atualizar fatura: ${error.message}`);
  }

  if (!updatedFatura) {
    throw new Error('Fatura não encontrada');
  }

  console.log('Status atualizado com sucesso:', updatedFatura);
  return updatedFatura as Fatura;
};
