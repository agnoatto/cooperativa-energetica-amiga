
/**
 * Componente para exibir o total de percentual alocado no rateio
 * 
 * Este componente mostra o total de percentual distribuído entre as unidades
 * e destaca com cor vermelha quando o total excede 100%.
 */
import React from "react";

interface TotalPercentualIndicatorProps {
  total: number;
}

export function TotalPercentualIndicator({ total }: TotalPercentualIndicatorProps) {
  const isExceeded = total > 100;
  
  return (
    <div className="text-sm">
      Total: <span className={isExceeded ? "text-red-500 font-bold" : ""}>
        {total.toFixed(2)}%
      </span>
    </div>
  );
}
