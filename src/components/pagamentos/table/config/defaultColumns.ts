
/**
 * Configuração padrão de colunas para a tabela de pagamentos
 * 
 * Este arquivo define as colunas padrão com suas propriedades como largura,
 * largura mínima e rótulos. Centraliza a configuração de colunas para facilitar
 * manutenção.
 */
import { Column } from "@/components/ui/excel-table/types";

export const defaultColumns: Column[] = [
  {
    id: 'uc',
    label: 'UC',
    width: 120,
    minWidth: 100
  },
  {
    id: 'investidor',
    label: 'Investidor',
    width: 200,
    minWidth: 160
  },
  {
    id: 'geracao',
    label: 'Geração (kWh)',
    width: 120,
    minWidth: 100
  },
  {
    id: 'valor_concessionaria',
    label: 'Valor Concess.',
    width: 150,
    minWidth: 130
  },
  {
    id: 'valor_total',
    label: 'Valor Total',
    width: 150,
    minWidth: 130
  },
  {
    id: 'vencimento',
    label: 'Vencimento',
    width: 120,
    minWidth: 100
  },
  {
    id: 'status',
    label: 'Status',
    width: 110,
    minWidth: 90
  },
  {
    id: 'arquivo_conta',
    label: 'Conta',
    width: 120,
    minWidth: 100
  },
  {
    id: 'acoes',
    label: 'Ações',
    width: 140,
    minWidth: 120
  }
];
