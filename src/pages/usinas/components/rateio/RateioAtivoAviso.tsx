
/**
 * Componente de aviso sobre rateio ativo existente
 * 
 * Este componente exibe um alerta informando que já existe um rateio ativo
 * para a usina e que ele será finalizado automaticamente quando um novo for criado.
 */
import React from "react";

export function RateioAtivoAviso() {
  return (
    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
      Já existe um rateio ativo para esta usina. Ao criar um novo, o rateio atual 
      será automaticamente finalizado na data anterior ao início do novo rateio.
    </div>
  );
}
