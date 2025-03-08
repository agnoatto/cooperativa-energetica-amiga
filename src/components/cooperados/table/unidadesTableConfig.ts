
import { Column } from "@/components/ui/excel-table/types";

export const unidadesTableColumns: Column[] = [
  { id: 'numero_uc', label: 'Número UC', width: 130 },
  { id: 'cooperado', label: 'Cooperado', minWidth: 180 },
  { id: 'apelido', label: 'Apelido', width: 150 },
  { id: 'endereco', label: 'Endereço', minWidth: 250 },
  { id: 'percentual_desconto', label: 'Desconto', width: 100 },
  { id: 'consumo_kwh', label: 'Consumo', width: 120 },
  { id: 'data_entrada', label: 'Data Entrada', width: 130 },
  { id: 'data_saida', label: 'Data Saída', width: 130 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'acoes', label: 'Ações', width: 110 }
];

// Storage key para persistir configurações
export const UNIDADES_TABLE_STORAGE_KEY = 'unidades-beneficiarias-table-settings';

// Função para recuperar as configurações salvas
export const getStoredTableSettings = (): {
  visibleColumns: string[];
} => {
  const defaultColumns = unidadesTableColumns.map(col => col.id);
  
  try {
    const stored = localStorage.getItem(UNIDADES_TABLE_STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      return {
        visibleColumns: settings.visibleColumns || defaultColumns
      };
    }
  } catch (error) {
    console.error("Erro ao ler configurações da tabela:", error);
  }
  
  return {
    visibleColumns: defaultColumns
  };
};

// Função para salvar as configurações
export const saveTableSettings = (settings: { visibleColumns: string[] }) => {
  try {
    localStorage.setItem(UNIDADES_TABLE_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Erro ao salvar configurações da tabela:", error);
  }
};
