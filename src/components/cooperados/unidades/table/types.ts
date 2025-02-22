
export interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}

export interface ActionMenuProps {
  unidade: any;
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}

export interface UnidadeMobileCardProps {
  unidade: any;
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}
