
/**
 * Componente principal de tabela de unidades beneficiárias
 * 
 * Este componente orquestra a exibição das unidades beneficiárias,
 * escolhendo entre a visualização mobile ou desktop com base no tamanho da tela.
 * Integra a lógica de ordenação, diálogos de detalhes e confirmação de ações.
 */
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnidadeDetailsDialog } from "./UnidadeDetailsDialog";
import { DesativarUnidadeDialog } from "./dialogs/DesativarUnidadeDialog";
import { UnidadeMobileCard } from "./table/unidades/UnidadeMobileCard";
import { UnidadesDesktopTable } from "./table/unidades/UnidadesDesktopTable";
import { useUnidadesSorting } from "./table/unidades/useUnidadesSorting";

interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string, motivo?: string) => Promise<void>;
  onReativar?: (unidadeId: string) => Promise<void>;
  showCooperadoInfo?: boolean;
}

export function UnidadesTable({
  unidades,
  onEdit,
  onDelete,
  onReativar,
  showCooperadoInfo = false,
}: UnidadesTableProps) {
  const isMobile = useIsMobile();
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [unidadeToDesativar, setUnidadeToDesativar] = useState<any>(null);
  const [isDesativando, setIsDesativando] = useState(false);
  
  // Utilizando o hook de ordenação
  const { sortField, sortDirection, handleSort, sortedUnidades } = useUnidadesSorting(unidades);

  const handleViewDetails = (unidade: any) => {
    setSelectedUnidade(unidade);
    setShowDetailsDialog(true);
  };

  const handleDesativarConfirm = async (unidadeId: string, motivo: string) => {
    setIsDesativando(true);
    try {
      await onDelete(unidadeId, motivo);
    } finally {
      setIsDesativando(false);
      setUnidadeToDesativar(null);
    }
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {sortedUnidades.map((unidade) => (
            <UnidadeMobileCard
              key={unidade.id}
              unidade={unidade}
              onViewDetails={handleViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onReativar={onReativar}
              setUnidadeToDesativar={setUnidadeToDesativar}
            />
          ))}
        </div>

        <UnidadeDetailsDialog
          unidade={selectedUnidade}
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedUnidade(null);
          }}
        />

        <DesativarUnidadeDialog
          unidade={unidadeToDesativar}
          isOpen={!!unidadeToDesativar}
          isProcessing={isDesativando}
          onConfirm={handleDesativarConfirm}
          onCancel={() => setUnidadeToDesativar(null)}
        />
      </>
    );
  }

  return (
    <>
      <UnidadesDesktopTable
        unidades={sortedUnidades}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onEdit={onEdit}
        onReativar={onReativar}
        setUnidadeToDesativar={setUnidadeToDesativar}
      />

      <UnidadeDetailsDialog
        unidade={selectedUnidade}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedUnidade(null);
        }}
      />

      <DesativarUnidadeDialog
        unidade={unidadeToDesativar}
        isOpen={!!unidadeToDesativar}
        isProcessing={isDesativando}
        onConfirm={handleDesativarConfirm}
        onCancel={() => setUnidadeToDesativar(null)}
      />
    </>
  );
}
