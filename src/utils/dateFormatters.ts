
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDateToPtBR = (isoDate: string) => {
  // parseISO will create a date object without timezone conversion
  const date = parseISO(isoDate);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};
