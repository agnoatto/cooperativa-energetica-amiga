
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  return (
    <NumericFormat
      customInput={Input}
      value={value}
      onValueChange={(values) => {
        onChange(values.floatValue || 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      className={cn(className)}
      {...props}
    />
  );
}
