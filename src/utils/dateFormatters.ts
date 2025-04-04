
/**
 * Utilitários para formatação de datas
 * 
 * Este arquivo contém funções auxiliares para formatação de datas
 * em formatos específicos para o sistema de gestão de energia.
 */
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para o formato brasileiro dd/MM/yyyy
 * 
 * @param dateString String de data em formato ISO ou objeto Date
 * @returns String formatada ou traço em caso de data inválida
 */
export function formatDateToPtBR(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) return '-';
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '-';
  }
}

/**
 * Formata uma data para o formato brasileiro dd/MM/yyyy HH:mm
 * 
 * @param dateString String de data em formato ISO ou objeto Date
 * @returns String formatada ou traço em caso de data inválida
 */
export function formatDateTimeToPtBR(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) return '-';
    
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return '-';
  }
}

/**
 * Formata uma data para exibir apenas o mês e ano em formato brasileiro
 * 
 * @param dateString String de data em formato ISO ou objeto Date
 * @returns String formatada no padrão MMM/yyyy (ex: jan/2023)
 */
export function formatMonthYearToPtBR(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) return '-';
    
    return format(date, 'MMM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar mês e ano:', error);
    return '-';
  }
}

/**
 * Converte uma data local para UTC
 * 
 * @param dateString String de data em formato ISO ou objeto Date
 * @returns String em formato ISO com timezone UTC
 */
export function convertLocalToUTC(dateString: string | Date | null | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) return null;
    
    return date.toISOString();
  } catch (error) {
    console.error('Erro ao converter data para UTC:', error);
    return null;
  }
}

/**
 * Converte uma data UTC para local
 * 
 * @param dateString String de data em formato ISO UTC
 * @returns String no formato YYYY-MM-DD para uso em inputs de formulário
 */
export function convertUTCToLocal(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) return '';
    
    // Format as YYYY-MM-DD for form inputs
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Erro ao converter data de UTC para local:', error);
    return '';
  }
}
