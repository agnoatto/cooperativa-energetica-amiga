
import { useIsMobile } from "@/hooks/use-mobile";
import { UnidadeMobileCard } from "./unidades/table/UnidadeMobileCard";
import { DesktopTable } from "./unidades/table/DesktopTable";
import { UnidadesTableProps } from "./unidades/table/types";

export function UnidadesTable(props: UnidadesTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {props.unidades.map((unidade) => (
          <UnidadeMobileCard
            key={unidade.id}
            unidade={unidade}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
          />
        ))}
      </div>
    );
  }

  return <DesktopTable {...props} />;
}
