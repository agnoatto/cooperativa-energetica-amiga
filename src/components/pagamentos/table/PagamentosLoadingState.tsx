
import React from "react";

export function PagamentosLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-sm text-gray-500">Carregando pagamentos...</p>
      </div>
    </div>
  );
}
