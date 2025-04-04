
/**
 * Configuração de colunas padrão para a tabela de lançamentos financeiros
 * 
 * Centraliza a definição das colunas usadas na tabela de lançamentos,
 * incluindo configurações de largura, rótulos e dimensões mínimas.
 */
import { Column } from "@/components/ui/excel-table/types";

export const defaultColumns: Column[] = [
  {
    id: 'descricao',
    label: 'Descrição',
    width: 200,
    minWidth: 180
  },
  {
    id: 'contato',
    label: 'Cooperado',
    width: 200,
    minWidth: 160
  },
  {
    id: 'vencimento',
    label: 'Vencimento',
    width: 120,
    minWidth: 100
  },
  {
    id: 'valor',
    label: 'Valor',
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
    id: 'acoes',
    label: 'Ações',
    width: 120,
    minWidth: 100
  }
];
