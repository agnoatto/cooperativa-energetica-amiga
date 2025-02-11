
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number;
  onChange: (value: number) => void;
  decimalScale?: number;
}

export function CurrencyInput({ value, onChange, className, decimalScale = 4, ...props }: CurrencyInputProps) {
  const handleValueChange = (values: { floatValue: number | undefined }) => {
    onChange(values.floatValue || 0);
  };

  // Converte o valor inicial para número se for string
  const initialValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  return (
    <NumericFormat
      customInput={Input}
      value={initialValue}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={decimalScale}
      fixedDecimalScale
      prefix="R$ "
      className={cn(className)}
      allowNegative={false}
    />
  );
}
