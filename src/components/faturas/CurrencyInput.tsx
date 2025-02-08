
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  // Convert string value with comma to number format
  const parseValue = (val: string) => {
    return val.replace(/\./g, '').replace(',', '.');
  };

  // Format number back to string with comma
  const formatValue = (val: string) => {
    return val.replace('.', ',');
  };

  return (
    <NumericFormat
      customInput={Input}
      value={value}
      onValueChange={(values) => {
        onChange(formatValue(values.value));
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      className={cn(className)}
      type="text"
      {...props}
    />
  );
}
