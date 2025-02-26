
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
  console.log('Iniciando atualização de status:', { id, status, observacao });

  // 1. Verificar se a fatura existe e seu status atual
  const { data: currentFatura, error: fetchError } = await supabase
    .from("faturas")
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError) {
    const errorMessage = `Erro ao buscar fatura: ${fetchError.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!currentFatura) {
    const errorMessage = 'Fatura não encontrada';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log('Status atual da fatura:', currentFatura.status);
  console.log('Novo status desejado:', status);

  // 2. Atualizar status da fatura com log detalhado
  try {
    const updateData = {
      status,
      data_envio: status === 'enviada' ? new Date().toISOString() : undefined,
      data_atualizacao: new Date().toISOString(),
      observacao: observacao
    };

    console.log('Dados para atualização:', updateData);

    const { data: updatedFatura, error: updateError } = await supabase
      .from("faturas")
      .update(updateData)
      .eq('id', id)
      .select('*, unidade_beneficiaria (*)')
      .single();

    if (updateError) {
      const errorMessage = `Erro na atualização: ${updateError.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!updatedFatura) {
      const errorMessage = 'Fatura não foi atualizada';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    // 3. Verificar se a atualização foi bem sucedida
    console.log('Fatura atualizada com sucesso:', {
      id: updatedFatura.id,
      statusAnterior: currentFatura.status,
      novoStatus: updatedFatura.status
    });

    return updatedFatura as unknown as Fatura;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao atualizar fatura';
    console.error('Erro detalhado:', error);
    throw new Error(errorMessage);
  }
};
