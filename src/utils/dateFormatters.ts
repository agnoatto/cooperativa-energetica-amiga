
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const TIMEZONE_BR = 'America/Sao_Paulo';

// Converte uma data ISO para o formato dd/MM/yyyy considerando timezone BR
export const formatDateToPtBR = (isoDate: string) => {
  if (!isoDate) return '';
  
  try {
    // Converte a data para o timezone do Brasil considerando meio-dia para evitar problemas de UTC
    const zonedDate = toZonedTime(new Date(isoDate + 'T12:00:00'), TIMEZONE_BR);
    return format(zonedDate, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

// Converte uma data do formulário (local) para UTC antes de enviar ao banco
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  try {
    // Adiciona o horário meio-dia e timezone Brasil para garantir a data correta
    const date = toZonedTime(new Date(localDate + 'T12:00:00'), TIMEZONE_BR);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erro ao converter data para UTC:', error);
    return null;
  }
};

// Converte uma data UTC do banco para local (formulário)
export const convertUTCToLocal = (utcDate: string | null) => {
  if (!utcDate) return '';
  
  try {
    // Adiciona o horário meio-dia para garantir a data correta
    const date = toZonedTime(new Date(utcDate + 'T12:00:00'), TIMEZONE_BR);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Erro ao converter data para local:', error);
    return '';
  }
};
