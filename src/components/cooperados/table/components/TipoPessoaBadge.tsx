
/**
 * Componente para exibir o badge de tipo de pessoa (PF ou PJ)
 * 
 * Este componente renderiza um badge visual que indica se o cooperado
 * é uma pessoa física ou jurídica, com ícones e cores diferentes para cada tipo.
 */
import { BuildingIcon, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TipoPessoaBadgeProps {
  tipoPessoa: "PF" | "PJ";
}

export function TipoPessoaBadge({ tipoPessoa }: TipoPessoaBadgeProps) {
  if (tipoPessoa === "PF") {
    return (
      <Badge variant="outline" className="bg-blue-50">
        <User2 className="mr-1 h-3 w-3" />
        Pessoa Física
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-amber-50">
      <BuildingIcon className="mr-1 h-3 w-3" />
      Pessoa Jurídica
    </Badge>
  );
}
