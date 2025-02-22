
import { Column } from "@/components/ui/excel-table/types";

export const cooperadosTableColumns: Column[] = [
  { id: 'info', label: 'Informações', minWidth: 200 },
  { id: 'cadastro', label: 'Nº Cadastro', width: 120 },
  { id: 'tipo', label: 'Tipo', width: 120 },
  { id: 'contato', label: 'Contato', minWidth: 150 },
  { id: 'unidades', label: 'Unidades', width: 100 },
  { id: 'acoes', label: 'Ações', width: 100 }
];
