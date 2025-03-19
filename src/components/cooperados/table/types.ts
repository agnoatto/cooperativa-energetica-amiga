
export interface CooperadoTableProps {
  cooperados: any[];
  unidades: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
  onAddUnidade: (id: string) => void;
  onViewDetails: (id: string) => void;
  statusFilter: "ativos" | "inativos" | "todos";
}
