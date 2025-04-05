
/**
 * Tipos para o módulo de Contas e Bancos
 * 
 * Este arquivo define tipos e interfaces para gerenciamento de contas bancárias,
 * caixas, conciliação bancária e transferências entre contas.
 */

export type TipoContaBancaria = 'corrente' | 'poupanca' | 'investimento' | 'caixa';
export type StatusContaBancaria = 'ativa' | 'inativa' | 'bloqueada';
export type TipoTransferencia = 'interna' | 'externa' | 'entrada' | 'saida';
export type StatusTransferencia = 'pendente' | 'concluida' | 'cancelada' | 'falha';

export interface ContaBancaria {
  id: string;
  nome: string;
  tipo: TipoContaBancaria;
  status: StatusContaBancaria;
  banco?: string;
  agencia?: string;
  conta?: string;
  digito?: string;
  saldo_atual: number;
  saldo_inicial: number;
  data_saldo_inicial: string;
  descricao?: string;
  cor?: string;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface TransferenciaBancaria {
  id: string;
  conta_origem_id: string;
  conta_destino_id?: string;
  valor: number;
  data_transferencia: string;
  data_conciliacao?: string;
  status: StatusTransferencia;
  descricao?: string;
  observacao?: string;
  comprovante_path?: string;
  comprovante_nome?: string;
  comprovante_tipo?: string;
  historico_status?: Array<{
    data: string;
    status_anterior: StatusTransferencia;
    novo_status: StatusTransferencia;
  }>;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  
  // Relacionamentos
  conta_origem?: ContaBancaria;
  conta_destino?: ContaBancaria;
}

export interface SaldoDiario {
  id: string;
  conta_bancaria_id: string;
  data: string;
  saldo_inicial: number;
  saldo_final: number;
  entradas: number;
  saidas: number;
  created_at: string;
  updated_at: string;
  
  // Relacionamento
  conta_bancaria?: ContaBancaria;
}

export interface ExtratoItem {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  lancamento_id?: string;
  transferencia_id?: string;
  conciliado: boolean;
  data_conciliacao?: string;
}
