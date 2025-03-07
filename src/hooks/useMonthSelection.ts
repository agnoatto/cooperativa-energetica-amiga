
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

  return {
    selectedDate,
    handleMonthChange,
    handleYearChange
  };
};
