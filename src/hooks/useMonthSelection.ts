
import { useState } from "react";

export const useMonthSelection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Função para log de depuração
  const logDateChange = (operation: string, oldDate: Date, newDate: Date) => {
    console.log(
      `[useMonthSelection] ${operation}: ` +
      `${oldDate.getMonth() + 1}/${oldDate.getFullYear()} -> ` +
      `${newDate.getMonth() + 1}/${newDate.getFullYear()}`
    );
  };

  const handleMonthChange = (month: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(month);
      // Não precisamos ajustar o ano aqui pois setMonth já cuida disso
      logDateChange("handleMonthChange", prev, newDate);
      return newDate;
    });
  };

  const handleYearChange = (year: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      logDateChange("handleYearChange", prev, newDate);
      return newDate;
    });
  };

  const handlePreviousMonth = () => {
    setSelectedDate(prev => {
      // Criar nova data para não modificar a referência original
      const newDate = new Date(prev);
      const currentMonth = prev.getMonth();
      const currentYear = prev.getFullYear();
      
      // Se estivermos em janeiro, vamos para dezembro do ano anterior
      if (currentMonth === 0) {
        newDate.setFullYear(currentYear - 1);
        newDate.setMonth(11); // dezembro
      } else {
        // Caso contrário, apenas decrementamos o mês
        newDate.setMonth(currentMonth - 1);
      }
      
      logDateChange("handlePreviousMonth", prev, newDate);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      // Criar nova data para não modificar a referência original
      const newDate = new Date(prev);
      const currentMonth = prev.getMonth();
      const currentYear = prev.getFullYear();
      
      // Se estivermos em dezembro, vamos para janeiro do próximo ano
      if (currentMonth === 11) {
        newDate.setFullYear(currentYear + 1);
        newDate.setMonth(0); // janeiro
      } else {
        // Caso contrário, apenas incrementamos o mês
        newDate.setMonth(currentMonth + 1);
      }
      
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
