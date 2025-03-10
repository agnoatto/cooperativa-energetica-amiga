
import { FaturaStatus } from "@/types/fatura";

export const getStatusColor = (status: FaturaStatus) => {
  const colors = {
    pendente: 'bg-gray-100 text-gray-800', // Alterado: agora é o status inicial, usando cor mais neutra
    gerada: 'bg-blue-100 text-blue-800',   // Alterado: agora é o status intermediário, usando cor de processo
    enviada: 'bg-green-100 text-green-800', // Mantido: status após envio
    corrigida: 'bg-orange-100 text-orange-800',
    reenviada: 'bg-indigo-100 text-indigo-800',
    atrasada: 'bg-red-100 text-red-800',
    paga: 'bg-emerald-100 text-emerald-800',
    finalizada: 'bg-purple-100 text-purple-800'
  };
  return colors[status];
};

export const getStatusLabel = (status: FaturaStatus) => {
  const labels = {
    pendente: 'Pendente',     // Agora é o status inicial (fatura criada, aguardando preenchimento)
    gerada: 'Gerada',         // Agora é o segundo status (fatura preenchida, pronta para envio)
    enviada: 'Enviada',
    corrigida: 'Corrigida',
    reenviada: 'Reenviada',
    atrasada: 'Atrasada',
    paga: 'Paga',
    finalizada: 'Finalizada'
  };
  return labels[status];
};

// Novo: função para determinar qual botão de ação mostrar baseado no status atual
export const getNextActionButton = (status: FaturaStatus) => {
  switch (status) {
    case 'pendente':
      return { action: 'gerar', label: 'Marcar como Gerada', tooltip: 'Dados preenchidos, fatura pronta para envio' };
    case 'gerada':
      return { action: 'enviar', label: 'Marcar como Enviada', tooltip: 'Enviar fatura ao cliente' };
    case 'corrigida':
      return { action: 'reenviar', label: 'Reenviar Fatura', tooltip: 'Reenviar fatura após correção' };
    case 'enviada':
    case 'reenviada':
    case 'atrasada':
      return { action: 'pagar', label: 'Confirmar Pagamento', tooltip: 'Registrar pagamento da fatura' };
    case 'paga':
      return { action: 'finalizar', label: 'Finalizar', tooltip: 'Concluir processamento da fatura' };
    default:
      return null;
  }
};

// Novo: Função para verificar se uma transição é válida
export const isValidStatusTransition = (currentStatus: FaturaStatus, newStatus: FaturaStatus): boolean => {
  const validTransitions: Record<FaturaStatus, FaturaStatus[]> = {
    pendente: ['gerada', 'enviada'],        // Pode ir direto para enviada em casos especiais
    gerada: ['enviada', 'corrigida', 'pendente'], // Pode voltar para pendente se necessário
    enviada: ['paga', 'atrasada', 'corrigida'],
    corrigida: ['reenviada', 'atrasada'],
    reenviada: ['paga', 'atrasada', 'corrigida'],
    atrasada: ['paga', 'corrigida'],
    paga: ['finalizada'],
    finalizada: []
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
