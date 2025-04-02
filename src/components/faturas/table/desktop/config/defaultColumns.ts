
/**
 * Configuração padrão de colunas para a tabela de faturas
 * 
 * Este arquivo define as colunas padrão com suas propriedades como largura,
 * largura mínima e rótulos. Centraliza a configuração de colunas para facilitar
 * manutenção.
 */
import { Column } from "@/components/ui/excel-table/types";

export const defaultColumns: Column[] = [
  {
    id: 'cooperado',
    label: 'Cooperado',
    width: 300,
    minWidth: 200
  },
  {
    id: 'documento',
    label: 'CNPJ/CPF',
    width: 180,
    minWidth: 150
  },
  {
    id: 'uc',
    label: 'Instalação',
    width: 150,
    minWidth: 120
  },
  {
    id: 'vencimento',
    label: 'Data Vencimento',
    width: 150,
    minWidth: 120
  },
  {
    id: 'consumo',
    label: 'Consumo (kWh)',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_original',
    label: 'Valor Original',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_assinatura',
    label: 'Valor da Assinatura',
    width: 150,
    minWidth: 120
  },
  {
    id: 'status',
    label: 'Status',
    width: 130,
    minWidth: 100
  },
  {
    id: 'acoes',
    label: 'Ações',
    width: 120,
    minWidth: 100
  }
];
