
/**
 * Utilitários para transição de status de lançamentos financeiros
 * 
 * Este arquivo contém funções auxiliares para gerenciar as transições
 * entre diferentes status de lançamentos financeiros, incluindo
 * definições de estilo, rótulos e transições disponíveis.
 */
import { StatusLancamento } from "@/types/financeiro";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { createElement, ReactNode } from "react";

// Interface para definir a transição de status
export interface StatusTransition {
  value: StatusLancamento;
  label: string;
  className: string;
  icon: ReactNode;
}

// Função para obter as transições disponíveis com base no status atual
export function getAvailableStatusTransitions(currentStatus: StatusLancamento): StatusTransition[] {
  switch (currentStatus) {
    case 'pendente':
      return [
        { 
          value: 'pago', 
          label: 'Marcar como Pago', 
          className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200',
          icon: createElement(CheckCircle2, { className: "h-3.5 w-3.5" })
        },
        { 
          value: 'cancelado', 
          label: 'Cancelar', 
          className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200',
          icon: createElement(XCircle, { className: "h-3.5 w-3.5" })
        }
      ];
    case 'atrasado':
      return [
        { 
          value: 'pago', 
          label: 'Marcar como Pago', 
          className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200',
          icon: createElement(CheckCircle2, { className: "h-3.5 w-3.5" })
        },
        { 
          value: 'pendente', 
          label: 'Marcar como Pendente', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: createElement(RotateCcw, { className: "h-3.5 w-3.5" })
        },
        { 
          value: 'cancelado', 
          label: 'Cancelar', 
          className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200',
          icon: createElement(XCircle, { className: "h-3.5 w-3.5" })
        }
      ];
    case 'pago':
      return [
        { 
          value: 'pendente', 
          label: 'Marcar como Pendente', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: createElement(RotateCcw, { className: "h-3.5 w-3.5" })
        }
      ];
    case 'cancelado':
      return [
        { 
          value: 'pendente', 
          label: 'Reativar', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: createElement(RotateCcw, { className: "h-3.5 w-3.5" })
        }
      ];
    default:
      return [];
  }
}

// Função para obter a classe CSS do botão de confirmação com base no status
export function getButtonClassForStatus(status: StatusLancamento): string {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-600 text-white hover:bg-yellow-700';
    case 'pago':
      return 'bg-green-600 text-white hover:bg-green-700';
    case 'atrasado':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'cancelado':
      return 'bg-gray-600 text-white hover:bg-gray-700';
    default:
      return '';
  }
}

// Função para obter o rótulo de exibição para um status
export function getStatusLabel(status: StatusLancamento): string {
  const labels = {
    pendente: 'Pendente',
    pago: 'Pago',
    atrasado: 'Atrasado',
    cancelado: 'Cancelado'
  };
  return labels[status] || status;
}
