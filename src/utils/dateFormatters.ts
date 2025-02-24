
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE_BR = 'America/Sao_Paulo';

// Converte uma data ISO para o formato dd/MM/yyyy considerando timezone BR
export const formatDateToPtBR = (isoDate: string) => {
  if (!isoDate) return '';
  
  try {
    // Converte a data para o timezone do Brasil e formata
    return formatInTimeZone(
      new Date(isoDate),
      TIMEZONE_BR,
      'dd/MM/yyyy',
      { locale: ptBR }
    );
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

// Converte uma data do formulário (local) para UTC antes de enviar ao banco
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  try {
    // Converte a data local para UTC mantendo o mesmo dia
    const date = new Date(localDate);
    date.setUTCHours(12, 0, 0, 0); // Define meio-dia UTC para evitar problemas de timezone
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
    // Como estamos trabalhando apenas com datas (sem hora), 
    // retornamos a data diretamente sem conversão de timezone
    return utcDate;
  } catch (error) {
    console.error('Erro ao converter data para local:', error);
    return '';
  }
};
