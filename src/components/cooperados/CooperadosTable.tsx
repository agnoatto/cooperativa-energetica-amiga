
/**
 * Componente de tabela de cooperados
 * 
 * Este componente exibe os cooperados em formato de tabela para desktop
 * ou cards para dispositivos móveis, permitindo a visualização, edição,
 * exclusão, reativação e adição de unidades beneficiárias.
 */
import { useIsMobile } from "@/hooks/use-mobile";
import { CooperadoMobileCard } from "./table/CooperadoMobileCard";
import { DesktopTable } from "./table/DesktopTable";
import { CooperadoTableProps } from "./table/types";

export function CooperadosTable(props: CooperadoTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {props.cooperados.map((cooperado) => (
          <CooperadoMobileCard
            key={cooperado.id}
            cooperado={cooperado}
            unidades={props.unidades}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onReactivate={props.onReactivate}
            onAddUnidade={props.onAddUnidade}
            onViewDetails={props.onViewDetails}
            statusFilter={props.statusFilter}
          />
        ))}
      </div>
    );
  }

  return <DesktopTable {...props} />;
}
