
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  // Converte o valor inicial para string formatada se for number
  const initialValue = typeof value === 'number' 
    ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : value;

  return (
    <NumericFormat
      customInput={Input}
      value={initialValue}
      onValueChange={(values) => {
        // Passa o valor formatado (com R$) para o componente pai
        onChange(values.formattedValue);
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      className={cn(className)}
    />
  );
}
