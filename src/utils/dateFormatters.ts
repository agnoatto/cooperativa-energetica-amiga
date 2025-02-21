
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const TIMEZONE_BR = 'America/Sao_Paulo';

// Converte uma data ISO para o formato dd/MM/yyyy considerando timezone BR
export const formatDateToPtBR = (isoDate: string) => {
  // Garante que a data seja interpretada corretamente no timezone do Brasil
  return formatInTimeZone(
    parseISO(isoDate), 
    TIMEZONE_BR, 
    'dd/MM/yyyy', 
    { locale: ptBR }
  );
};

// Converte uma data do formulário (local) para UTC antes de enviar ao banco
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  // Cria uma data no timezone do Brasil
  const brasilDate = fromZonedTime(localDate, TIMEZONE_BR);
  
  // Retorna apenas a data (sem tempo) em formato ISO
  return format(brasilDate, 'yyyy-MM-dd');
};

// Converte uma data UTC do banco para local (formulário)
export const convertUTCToLocal = (utcDate: string | null) => {
  if (!utcDate) return '';
  
  // Converte para o timezone do Brasil e formata para o input date
  return formatInTimeZone(parseISO(utcDate), TIMEZONE_BR, 'yyyy-MM-dd');
};
