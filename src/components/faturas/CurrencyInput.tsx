
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
  // Modificamos para passar o valor não-formatado (numérico) para o onChange
  const handleValueChange = (values: { formattedValue: string; value: string }) => {
    // Passamos o valor não-formatado para ser usado em cálculos
    // Este é o valor numérico puro como string (sem formatação)
    onChange(values.value);
    
    console.log('[CurrencyInput] Valor formatado:', values.formattedValue);
    console.log('[CurrencyInput] Valor numérico:', values.value);
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
      className={cn(className)}
      allowNegative={false}
      type="text"
      {...props}
    />
  );
}
