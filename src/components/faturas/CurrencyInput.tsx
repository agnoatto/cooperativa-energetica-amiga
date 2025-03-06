
import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Definindo um tipo específico para as props do CurrencyInput
type CurrencyInputProps = {
  value: string;
  onChange: (value: string) => void;
  decimalScale?: number;
  className?: string;
} & Omit<NumericFormatProps, 'value' | 'onChange' | 'customInput'>;

export function CurrencyInput({ 
  value, 
  onChange, 
  className, 
  decimalScale = 2, 
  ...props 
}: CurrencyInputProps) {
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
      type="text"
      {...props}
    />
  );
}
