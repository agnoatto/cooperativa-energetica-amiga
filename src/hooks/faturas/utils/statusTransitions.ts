
import { FaturaStatus } from "@/types/fatura";

const allowedTransitions: Record<FaturaStatus, FaturaStatus[]> = {
  'gerada': ['pendente'],
  'pendente': ['enviada'],
  'enviada': ['corrigida', 'atrasada', 'paga'],
  'corrigida': ['reenviada'],
  'reenviada': ['corrigida', 'atrasada', 'paga'],
  'atrasada': ['paga'],
  'paga': ['finalizada'],
  'finalizada': []
};

export const validateStatusTransition = (currentStatus: FaturaStatus, newStatus: FaturaStatus): boolean => {
  const isAllowed = allowedTransitions[currentStatus]?.includes(newStatus) || false;
  console.log('Validação de transição:', {
    de: currentStatus,
    para: newStatus,
    permitido: isAllowed
  });
  return isAllowed;
};
