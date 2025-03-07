
import { useState } from "react";

export const useMonthSelection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMonthChange = (month: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(month);
      return newDate;
    });
  };

  const handleYearChange = (year: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
  };

  const handlePreviousMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
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
