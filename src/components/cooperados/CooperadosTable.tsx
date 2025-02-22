
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
            onAddUnidade={props.onAddUnidade}
            onViewDetails={props.onViewDetails}
          />
        ))}
      </div>
    );
  }

  return <DesktopTable {...props} />;
}
