
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const TIMEZONE_BR = 'America/Sao_Paulo';

// Converte uma data ISO para o formato dd/MM/yyyy considerando timezone BR
export const formatDateToPtBR = (isoDate: string) => {
  if (!isoDate) return '';
  
  // Adiciona o horário meio-dia para evitar problemas com timezone
  const dateWithNoon = `${isoDate}T12:00:00`;
  
  return format(parseISO(dateWithNoon), 'dd/MM/yyyy', { locale: ptBR });
};

// Converte uma data do formulário (local) para UTC antes de enviar ao banco
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  // Retorna apenas a data, sem conversão de timezone pois o banco espera apenas DATE
  return localDate;
};

// Converte uma data UTC do banco para local (formulário)
export const convertUTCToLocal = (utcDate: string | null) => {
  if (!utcDate) return '';
  
  // Como o banco armazena apenas DATE, retornamos diretamente
  return utcDate;
};
