
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  decimalScale?: number;
}

export function CurrencyInput({ value, onChange, className, decimalScale = 4, ...props }: CurrencyInputProps) {
  const handleValueChange = (values: { formattedValue: string }) => {
    onChange(values.formattedValue);
  };

  return (
    <NumericFormat
      customInput={Input}
      value={value}
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
