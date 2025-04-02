
/**
 * Componente de cabeçalho do card de fatura mobile
 * 
 * Exibe o número da UC, apelido opcional e o status da fatura
 * em um layout otimizado para dispositivos móveis.
 */
import { Fatura } from "@/types/fatura";
import { FaturaStatusBadge } from "../../FaturaStatusBadge";

interface FaturaCardHeaderProps {
  fatura: Fatura;
}

export function FaturaCardHeader({ fatura }: FaturaCardHeaderProps) {
  const unidade = fatura.unidade_beneficiaria;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-medium">UC {fatura.unidade_beneficiaria.numero_uc}</span>
        {unidade.apelido && (
          <span className="ml-2 text-sm text-muted-foreground">({unidade.apelido})</span>
        )}
      </div>
      <FaturaStatusBadge fatura={fatura} />
    </div>
  );
}
