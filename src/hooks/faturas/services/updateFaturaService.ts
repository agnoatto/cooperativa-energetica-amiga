
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
  console.log('[updateFaturaService] Atualizando status da fatura:', { id, status, observacao });

  // Verificando se a fatura existe antes de tentar atualizar
  const { data: existingFatura, error: checkError } = await supabase
    .from("faturas")
    .select('id, status')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('[updateFaturaService] Erro ao verificar fatura:', checkError);
    throw new Error(`Erro ao verificar fatura: ${checkError.message}`);
  }
  
  console.log('[updateFaturaService] Fatura existente:', existingFatura);

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
    console.error('[updateFaturaService] Erro ao atualizar fatura:', error);
    throw new Error(`Erro ao atualizar fatura: ${error.message}`);
  }

  if (!updatedFatura) {
    console.error('[updateFaturaService] Fatura não encontrada após atualização');
    throw new Error('Fatura não encontrada');
  }

  console.log('[updateFaturaService] Status atualizado com sucesso:', updatedFatura);
  return updatedFatura as Fatura;
};
