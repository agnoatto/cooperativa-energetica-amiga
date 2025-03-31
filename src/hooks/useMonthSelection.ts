
/**
 * Hook para gerenciar a seleção de meses
 * 
 * Este hook encapsula a lógica de navegação entre meses, permitindo
 * avançar ou retroceder meses, além de selecionar meses e anos específicos.
 * Fornece logs detalhados para depuração e datas formatadas para UI.
 */
import { useState } from "react";

export const useMonthSelection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Função para log de depuração melhorada
  const logDateChange = (operation: string, oldDate: Date, newDate: Date) => {
    console.log(
      `[useMonthSelection] ${operation}: ` +
      `${oldDate.getMonth() + 1}/${oldDate.getFullYear()} → ` +
      `${newDate.getMonth() + 1}/${newDate.getFullYear()}`
    );
  };

  // Cria uma nova data com o mês e ano desejados
  const createNewDate = (year: number, month: number): Date => {
    // Criamos uma nova data no dia 15 para evitar problemas com dias inválidos em meses diferentes
    const newDate = new Date(year, month, 15, 12, 0, 0);
    return newDate;
  };

  const handleMonthChange = (month: number) => {
    setSelectedDate(prev => {
      // Mantém o mesmo ano ao mudar o mês diretamente
      const newDate = createNewDate(prev.getFullYear(), month);
      logDateChange("handleMonthChange", prev, newDate);
      return newDate;
    });
  };

  const handleYearChange = (year: number) => {
    setSelectedDate(prev => {
      // Mantém o mesmo mês ao mudar o ano diretamente
      const newDate = createNewDate(year, prev.getMonth());
      logDateChange("handleYearChange", prev, newDate);
      return newDate;
    });
  };

  const handlePreviousMonth = () => {
    setSelectedDate(prev => {
      const currentMonth = prev.getMonth();
      const currentYear = prev.getFullYear();
      
      let newMonth: number;
      let newYear: number;
      
      // Se estamos em janeiro (0), vamos para dezembro (11) do ano anterior
      if (currentMonth === 0) {
        newMonth = 11; // dezembro
        newYear = currentYear - 1;
      } else {
        // Caso contrário, apenas decrementamos o mês
        newMonth = currentMonth - 1;
        newYear = currentYear;
      }
      
      const newDate = createNewDate(newYear, newMonth);
      logDateChange("handlePreviousMonth", prev, newDate);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const currentMonth = prev.getMonth();
      const currentYear = prev.getFullYear();
      
      let newMonth: number;
      let newYear: number;
      
      // Se estamos em dezembro (11), vamos para janeiro (0) do próximo ano
      if (currentMonth === 11) {
        newMonth = 0; // janeiro
        newYear = currentYear + 1;
      } else {
        // Caso contrário, apenas incrementamos o mês
        newMonth = currentMonth + 1;
        newYear = currentYear;
      }
      
      const newDate = createNewDate(newYear, newMonth);
      logDateChange("handleNextMonth", prev, newDate);
      return newDate;
    });
  };

  return {
    selectedDate,
    currentDate: selectedDate, // Para compatibilidade
    handleMonthChange,
    handleYearChange,
    handlePreviousMonth,
    handleNextMonth
  };
};
