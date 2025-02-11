
import React from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const handleValueChange = (values: NumberFormatValues) => {
    // Garante que sempre teremos 4 casas decimais
    const formattedValue = values.floatValue !== undefined
      ? `R$ ${values.floatValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
          useGrouping: true
        }).replace(/\./g, '#').replace(/,/g, '.').replace(/#/g, ',')}`
      : 'R$ 0,0000';
    
    onChange(formattedValue);
  };

  // Converte o valor inicial para o formato correto se for number
  const initialValue = typeof value === 'number'
    ? value.toLocaleString('pt-BR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
        useGrouping: true
      })
    : value;

  return (
    <NumericFormat
      customInput={Input}
      value={initialValue}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={4}
      fixedDecimalScale
      prefix="R$ "
      className={cn(className)}
      valueIsNumericString
      allowNegative={false}
    />
  );
}
