
export interface Cooperado {
  id: string;
  nome: string;
  documento: string;
  tipo_pessoa: string;
  telefone: string | null;
  email: string | null;
  responsavel_nome: string | null;
  responsavel_cpf: string | null;
  responsavel_telefone: string | null;
  numero_cadastro: string | null;
}

export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  endereco: string;
  percentual_desconto: number;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  data_entrada: string;
  data_saida: string | null;
  consumo_kwh: number | null;
  possui_geracao_propria: boolean;
  potencia_instalada: number | null;
  cooperado: Cooperado;
}

export type FaturaStatus = 'pendente' | 'enviada' | 'corrigida' | 'reenviada' | 'atrasada' | 'paga' | 'finalizada';

export interface HistoricoFatura {
  mes: number;
  ano: number;
  consumo_kwh: number;
  valor_desconto: number;
}

export interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_assinatura: number;
  status: FaturaStatus;
  data_vencimento: string;
  mes: number;
  ano: number;
  fatura_concessionaria: number;
  total_fatura: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  economia_acumulada: number;
  saldo_energia_kwh: number;
  observacao: string | null;
  valor_adicional: number;
  observacao_pagamento: string | null;
  data_pagamento: string | null;
  arquivo_concessionaria_path: string | null;
  arquivo_concessionaria_nome: string | null;
  arquivo_concessionaria_tipo: string | null;
  arquivo_concessionaria_tamanho: number | null;
  data_envio?: string | null;
  data_confirmacao_pagamento?: string | null;
  data_criacao?: string;
  data_atualizacao?: string;
  data_proxima_leitura?: string | null;
  historico_faturas: HistoricoFatura[];
  unidade_beneficiaria: UnidadeBeneficiaria;
}
