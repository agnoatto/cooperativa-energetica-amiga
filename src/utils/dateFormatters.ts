
/**
 * Utilitários para formatação de datas
 * 
 * Este arquivo contém funções auxiliares para formatação de datas
 * em formatos específicos para o sistema de gestão de energia.
 */
import { format, isValid } from 'date-fns';
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
