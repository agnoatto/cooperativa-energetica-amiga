
/**
 * Tipos para lançamentos financeiros
 * 
 * Este arquivo define os tipos utilizados para consultas e operações
 * relacionadas a lançamentos financeiros
 */

import { TipoLancamento, StatusLancamento } from "@/types/financeiro";

export interface UseLancamentosFinanceirosOptions {
  tipo: TipoLancamento;
  status?: StatusLancamento | 'todos';
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface HistoricoStatus {
  data: string;
  status_anterior: StatusLancamento;
  novo_status: StatusLancamento;
  valor_pago?: number;
  valor_juros?: number;
  valor_desconto?: number;
}

export interface LancamentoResponse {
  id: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  descricao: string;
  valor: number;
  valor_original: number;
  valor_pago?: number | null;
  valor_juros?: number;
  valor_desconto?: number;
  data_vencimento: string;
  data_pagamento?: string;
  observacao?: string;
  cooperado_id?: string;
  investidor_id?: string;
  fatura_id?: string;
  pagamento_usina_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  historico_status: HistoricoStatus[] | null;
  comprovante_path?: string;
  comprovante_nome?: string;
  comprovante_tipo?: string;
  cooperado?: {
    nome: string;
    documento: string;
    telefone?: string;
    email?: string;
    numero_cadastro?: string;
  } | null;
  investidor?: {
    nome_investidor: string;
    documento: string;
    telefone?: string;
    email?: string;
  } | null;
  fatura?: {
    id: string;
    numero_fatura: string;
    mes?: number;
    ano?: number;
    data_vencimento: string; // Adicionando data_vencimento ao tipo fatura
    unidade_beneficiaria: {
      numero_uc: string;
      apelido?: string;
      endereco?: string;
    };
  } | null;
  pagamento_usina?: {
    id: string;
    valor_total?: number;
    geracao_kwh?: number;
    status: string;
    data_vencimento: string;
    data_pagamento?: string;
    mes?: number;
    ano?: number;
    usina?: {
      unidade_usina?: {
        numero_uc: string;
        apelido?: string;
      } | null;
    } | null;
  } | null;
}
