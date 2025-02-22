
import { Column } from "@/components/ui/excel-table/types";

export const unidadesTableColumns: Column[] = [
  { id: 'numero_uc', label: 'Número UC', width: 120 },
  { id: 'apelido', label: 'Apelido', width: 150 },
  { id: 'endereco', label: 'Endereço', minWidth: 250 },
  { id: 'desconto', label: 'Desconto', width: 100 },
  { id: 'data_entrada', label: 'Data Entrada', width: 120 },
  { id: 'acoes', label: 'Ações', width: 100 }
];
