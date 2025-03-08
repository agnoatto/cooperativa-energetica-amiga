
import { TableActionMenu, TableAction } from "@/components/ui/table-action-menu";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { ActionMenuProps } from "./types";

export function ActionMenu({ cooperado, onEdit, onDelete, onAddUnidade, onViewDetails }: ActionMenuProps) {
  const actions: TableAction[] = [
    {
      label: "Visualizar",
      icon: Eye,
      onClick: () => onViewDetails(cooperado.id)
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: () => onEdit(cooperado.id)
    },
    {
      label: "Adicionar Unidade",
      icon: Plus,
      onClick: () => onAddUnidade(cooperado.id)
    },
    {
      label: "Excluir",
      icon: Trash,
      onClick: () => onDelete(cooperado.id),
      destructive: true
    }
  ];

  return <TableActionMenu actions={actions} />;
}
