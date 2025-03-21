
/**
 * Serviço de atualização de faturas
 * 
 * Este serviço contém funções para atualizar faturas no banco de dados
 * e recuperar a fatura atualizada com todos os seus relacionamentos.
 */
import { supabase } from "@/integrations/supabase/client";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { UpdateFaturaInput } from "../types/updateFatura";
import { UpdateFaturaStatusInput } from "../types";

/**
 * Atualiza uma fatura e retorna a versão completa atualizada
 * 
 * @param data Dados da fatura a serem atualizados
 * @returns Fatura completa atualizada com todos os relacionamentos
 */
export async function updateFatura(data: UpdateFaturaInput): Promise<Fatura> {
  console.log("[updateFaturaService] Atualizando fatura:", data);

  try {
    // Extrair os campos de arquivo para tratá-los separadamente
    const {
      arquivo_concessionaria_nome,
      arquivo_concessionaria_path,
      arquivo_concessionaria_tipo,
      arquivo_concessionaria_tamanho,
      ...restData
    } = data;

    // Garantir que a data de vencimento esteja no formato correto (YYYY-MM-DD)
    let formattedData = { ...restData };
    
    console.log("[updateFaturaService] Data de vencimento recebida:", data.data_vencimento);
    console.log("[updateFaturaService] Data próxima leitura recebida:", data.data_proxima_leitura);

    // Atualizar a tabela faturas com os dados principais
    const { data: updatedFatura, error } = await supabase
      .from('faturas')
      .update({
        ...formattedData,
        arquivo_concessionaria_nome,
        arquivo_concessionaria_path,
        arquivo_concessionaria_tipo,
        arquivo_concessionaria_tamanho
      })
      .eq('id', data.id)
      .select('*')
      .single();

    if (error) {
      console.error("[updateFaturaService] Erro ao atualizar fatura:", error);
      throw new Error(`Erro ao atualizar fatura: ${error.message}`);
    }

    if (!updatedFatura) {
      console.error("[updateFaturaService] Fatura não encontrada após atualização");
      throw new Error("Fatura não encontrada após atualização");
    }

    console.log("[updateFaturaService] Fatura atualizada com sucesso:", updatedFatura);
    
    return await getFaturaCompleta(data.id, updatedFatura);
  } catch (error) {
    console.error("[updateFaturaService] Erro ao processar atualização:", error);
    throw error;
  }
}

/**
 * Atualiza o status de uma fatura
 * 
 * @param data Dados do status da fatura a serem atualizados
 * @returns Fatura atualizada com o novo status
 */
export async function updateFaturaStatus(data: UpdateFaturaStatusInput): Promise<Fatura> {
  console.log("[updateFaturaService] Atualizando status da fatura:", data);

  try {
    // Preparar os dados de atualização
    const updateData: Record<string, any> = {
      status: data.status,
    };

    // Adicionar campos opcionais se eles existirem
    if (data.observacao !== undefined) {
      updateData.observacao = data.observacao;
    }
    
    if (data.observacao_pagamento !== undefined) {
      updateData.observacao_pagamento = data.observacao_pagamento;
    }
    
    if (data.data_pagamento !== undefined) {
      updateData.data_pagamento = data.data_pagamento;
    }
    
    if (data.valor_adicional !== undefined) {
      updateData.valor_adicional = data.valor_adicional;
    }

    // Para faturas pagas, registrar a data de confirmação do pagamento
    if (data.status === 'paga') {
      updateData.data_confirmacao_pagamento = new Date().toISOString().split('T')[0];
    }

    // Atualizar a fatura
    const { data: updatedFatura, error } = await supabase
      .from('faturas')
      .update(updateData)
      .eq('id', data.id)
      .select('*')
      .single();

    if (error) {
      console.error("[updateFaturaService] Erro ao atualizar status da fatura:", error);
      throw new Error(`Erro ao atualizar status da fatura: ${error.message}`);
    }

    if (!updatedFatura) {
      console.error("[updateFaturaService] Fatura não encontrada após atualização de status");
      throw new Error("Fatura não encontrada após atualização de status");
    }

    console.log("[updateFaturaService] Status da fatura atualizado com sucesso:", updatedFatura);
    
    return await getFaturaCompleta(data.id, updatedFatura);
  } catch (error) {
    console.error("[updateFaturaService] Erro ao processar atualização de status:", error);
    throw error;
  }
}

/**
 * Busca a fatura completa com todos os relacionamentos
 * 
 * @param id ID da fatura
 * @param updatedFatura Dados da fatura já atualizados (se disponíveis)
 * @returns Fatura completa com todos os relacionamentos
 */
async function getFaturaCompleta(id: string, updatedFatura?: any): Promise<Fatura> {
  // Buscar a fatura completa para retornar com todos os relacionamentos
  const { data: completeFatura, error: completeError } = await supabase
    .from("faturas")
    .select(`
      id,
      consumo_kwh,
      valor_assinatura,
      status,
      data_vencimento,
      mes,
      ano,
      fatura_concessionaria,
      total_fatura,
      iluminacao_publica,
      outros_valores,
      valor_desconto,
      economia_acumulada,
      saldo_energia_kwh,
      observacao,
      valor_adicional,
      observacao_pagamento,
      data_pagamento,
      data_proxima_leitura,
      arquivo_concessionaria_nome,
      arquivo_concessionaria_path,
      arquivo_concessionaria_tipo,
      arquivo_concessionaria_tamanho,
      data_criacao,
      data_atualizacao,
      data_envio,
      data_confirmacao_pagamento,
      unidade_beneficiaria:unidade_beneficiaria_id (
        id,
        numero_uc,
        apelido,
        endereco,
        percentual_desconto,
        cidade,
        uf,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        data_entrada,
        data_saida,
        consumo_kwh,
        possui_geracao_propria,
        potencia_instalada,
        cooperado:cooperado_id (
          id,
          nome,
          documento,
          tipo_pessoa,
          telefone,
          email,
          responsavel_nome,
          responsavel_cpf,
          responsavel_telefone,
          numero_cadastro
        )
      )
    `)
    .eq("id", id)
    .single();

  if (completeError) {
    console.error("[updateFaturaService] Erro ao buscar fatura completa:", completeError);
    
    // Se não conseguimos buscar a fatura completa, tentamos construir a partir da atualizada
    // e buscando a unidade beneficiária separadamente
    if (updatedFatura) {
      return await construirFaturaComUnidade(updatedFatura);
    }
    
    throw new Error(`Erro ao buscar fatura completa: ${completeError.message}`);
  }

  // Verificar se o status é válido, caso contrário usar 'pendente'
  const validStatuses: FaturaStatus[] = ['pendente', 'enviada', 'corrigida', 'reenviada', 'atrasada', 'paga', 'finalizada'];
  const status = validStatuses.includes(completeFatura.status as FaturaStatus) 
    ? completeFatura.status as FaturaStatus
    : 'pendente' as FaturaStatus;

  // Montar o objeto com todos os campos necessários para tipo Fatura
  const result: Fatura = {
    ...completeFatura,
    status,
    historico_faturas: [], // Como não temos o histórico nessa consulta, inicializamos vazio
    valor_adicional: completeFatura.valor_adicional || 0,
    observacao_pagamento: completeFatura.observacao_pagamento || null,
    data_pagamento: completeFatura.data_pagamento || null,
    data_proxima_leitura: completeFatura.data_proxima_leitura || null,
    consumo_kwh: Number(completeFatura.consumo_kwh),
    valor_assinatura: Number(completeFatura.valor_assinatura),
    fatura_concessionaria: Number(completeFatura.fatura_concessionaria),
    total_fatura: Number(completeFatura.total_fatura),
    iluminacao_publica: Number(completeFatura.iluminacao_publica),
    outros_valores: Number(completeFatura.outros_valores),
    valor_desconto: Number(completeFatura.valor_desconto),
    saldo_energia_kwh: Number(completeFatura.saldo_energia_kwh),
    economia_acumulada: completeFatura.economia_acumulada || 0
  };

  return result;
}

/**
 * Constrói uma fatura completa buscando a unidade beneficiária separadamente
 * 
 * @param updatedFatura Dados da fatura atualizada
 * @returns Fatura completa com a unidade beneficiária
 */
async function construirFaturaComUnidade(updatedFatura: any): Promise<Fatura> {
  // Precisamos buscar dados da unidade beneficiária separadamente
  const { data: unidadeData, error: unidadeError } = await supabase
    .from("unidades_beneficiarias")
    .select(`
      id,
      numero_uc,
      apelido,
      endereco,
      percentual_desconto,
      cidade,
      uf,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      data_entrada,
      data_saida,
      consumo_kwh,
      possui_geracao_propria,
      potencia_instalada,
      cooperado:cooperado_id (
        id,
        nome,
        documento,
        tipo_pessoa,
        telefone,
        email,
        responsavel_nome,
        responsavel_cpf,
        responsavel_telefone,
        numero_cadastro
      )
    `)
    .eq("id", updatedFatura.unidade_beneficiaria_id)
    .single();
  
  if (unidadeError) {
    console.error("[updateFaturaService] Erro ao buscar unidade beneficiária:", unidadeError);
    throw new Error(`Erro ao buscar unidade beneficiária: ${unidadeError.message}`);
  }
  
  // Verificar e validar o status
  const validStatus: FaturaStatus[] = ['pendente', 'enviada', 'corrigida', 'reenviada', 'atrasada', 'paga', 'finalizada'];
  const status = validStatus.includes(updatedFatura.status as FaturaStatus) 
    ? updatedFatura.status as FaturaStatus 
    : 'pendente';
  
  // Construir objeto com a estrutura completa
  const fatura: Fatura = {
    ...updatedFatura,
    status,
    valor_adicional: updatedFatura.valor_adicional || 0,
    observacao_pagamento: updatedFatura.observacao_pagamento || null,
    data_pagamento: updatedFatura.data_pagamento || null,
    data_proxima_leitura: updatedFatura.data_proxima_leitura || null,
    historico_faturas: [], // Campo obrigatório
    consumo_kwh: Number(updatedFatura.consumo_kwh),
    valor_assinatura: Number(updatedFatura.valor_assinatura),
    fatura_concessionaria: Number(updatedFatura.fatura_concessionaria),
    total_fatura: Number(updatedFatura.total_fatura),
    iluminacao_publica: Number(updatedFatura.iluminacao_publica),
    outros_valores: Number(updatedFatura.outros_valores),
    valor_desconto: Number(updatedFatura.valor_desconto),
    saldo_energia_kwh: Number(updatedFatura.saldo_energia_kwh),
    economia_acumulada: updatedFatura.economia_acumulada || 0,
    unidade_beneficiaria: unidadeData
  };
  
  return fatura;
}
