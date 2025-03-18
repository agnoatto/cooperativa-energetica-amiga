
/**
 * Tipos para atualização de faturas
 * 
 * Define a estrutura de dados para a entrada de atualização de faturas,
 * incluindo campos obrigatórios e opcionais.
 */
export interface UpdateFaturaInput {
  id: string;
  consumo_kwh?: number;
  valor_assinatura?: number;
  data_vencimento?: string;
  data_proxima_leitura?: string | null;
  fatura_concessionaria?: number;
  total_fatura?: number;
  iluminacao_publica?: number;
  outros_valores?: number;
  valor_desconto?: number;
  economia_acumulada?: number;
  saldo_energia_kwh?: number;
  observacao?: string;
  arquivo_concessionaria_nome?: string | null;
  arquivo_concessionaria_path?: string | null;
  arquivo_concessionaria_tipo?: string | null;
  arquivo_concessionaria_tamanho?: number | null;
}
