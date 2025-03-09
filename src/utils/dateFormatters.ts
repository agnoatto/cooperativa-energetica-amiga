
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const TIMEZONE_BR = 'America/Sao_Paulo';

/**
 * Converte uma data ISO para o formato dd/MM/yyyy considerando timezone BR
 * Usada principalmente para exibição de datas na interface
 */
export const formatDateToPtBR = (isoDate: string) => {
  if (!isoDate) return '';
  
  try {
    // Simplificando para trabalhar com apenas a data, sem hora
    const dateParts = isoDate.split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Mês em JS começa em 0
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

/**
 * Converte uma data do formulário (local) para formato ISO simples (YYYY-MM-DD)
 * Usada ao enviar dados de data para o banco
 */
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  try {
    // Retornamos apenas a parte da data no formato YYYY-MM-DD
    return localDate.split('T')[0];
  } catch (error) {
    console.error('Erro ao converter data para ISO:', error);
    return null;
  }
};

/**
 * Converte uma data do banco para o formato usado em inputs de formulário (YYYY-MM-DD)
 */
export const convertUTCToLocal = (utcDate: string | null) => {
  if (!utcDate) return '';
  
  try {
    // Retornamos apenas a parte da data no formato YYYY-MM-DD
    return utcDate.split('T')[0];
  } catch (error) {
    console.error('Erro ao converter data para local:', error);
    return '';
  }
};
