
/**
 * Define as transições de status permitidas para faturas
 * 
 * Este arquivo contém as regras que determinam quais transições de status 
 * são permitidas para cada estado atual de uma fatura.
 * 
 * IMPORTANTE: Após o status "enviada"/"reenviada", o controle de pagamentos
 * e finalização é feito exclusivamente pelo módulo Financeiro.
 */

import { FaturaStatus } from "@/types/fatura";

// Definir quais status podem ser transicionados a partir do status atual
export const allowedTransitions: Record<FaturaStatus, FaturaStatus[]> = {
  pendente: ['enviada', 'corrigida'], // Transições permitidas a partir de pendente
  enviada: ['corrigida'], // Removido 'paga' e 'atrasada' - agora controlado pelo financeiro
  corrigida: ['reenviada'],
  reenviada: ['corrigida'], // Removido 'paga' e 'atrasada' - agora controlado pelo financeiro
  atrasada: ['corrigida'], // Removido 'paga' - agora controlado pelo financeiro
  paga: [], // Removido 'finalizada' - agora controlado pelo financeiro
  finalizada: []
};

// Verificar se uma transição de status é permitida
export const isTransitionAllowed = (
  currentStatus: FaturaStatus,
  newStatus: FaturaStatus
): boolean => {
  return allowedTransitions[currentStatus].includes(newStatus);
};

// Obter os próximos status possíveis para um status atual
export const getNextAllowedStatuses = (
  currentStatus: FaturaStatus
): FaturaStatus[] => {
  return allowedTransitions[currentStatus];
};

// Descrições amigáveis para as ações de transição
export const transitionActionLabels: Record<FaturaStatus, string> = {
  pendente: 'Voltar para Pendente',
  enviada: 'Enviar Fatura',
  corrigida: 'Marcar para Correção',
  reenviada: 'Reenviar Fatura',
  atrasada: 'Marcar como Atrasada',
  paga: 'Confirmar Pagamento',
  finalizada: 'Finalizar Fatura'
};

// Cores para os botões de transição
export const transitionButtonColors: Record<FaturaStatus, string> = {
  pendente: 'border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100',
  enviada: 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100',
  corrigida: 'border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-100',
  reenviada: 'border-indigo-300 bg-indigo-50 text-indigo-900 hover:bg-indigo-100',
  atrasada: 'border-red-300 bg-red-50 text-red-900 hover:bg-red-100',
  paga: 'border-green-300 bg-green-50 text-green-900 hover:bg-green-100',
  finalizada: 'border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100'
};

// Ícones para as transições de status
export const transitionIcons: Record<FaturaStatus, string> = {
  pendente: 'Clock',
  enviada: 'Send',
  corrigida: 'AlertCircle',
  reenviada: 'RotateCw',
  atrasada: 'AlertTriangle',
  paga: 'CheckCircle',
  finalizada: 'Flag'
};
