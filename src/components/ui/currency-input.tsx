
import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Definindo um tipo específico para as props do CurrencyInput
export type CurrencyInputProps = {
  value: string | number;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  decimalScale?: number;
};

export function CurrencyInput({ 
  value, 
  onValueChange, 
  className, 
  disabled,
  placeholder,
  id,
  decimalScale = 2,
  ...props 
}: CurrencyInputProps & Omit<NumericFormatProps, 'value' | 'onValueChange' | 'customInput'>) {
  // Converter para string se for número
  const stringValue = typeof value === 'number' ? value.toString() : value;
  
  // Modificamos para passar o valor não-formatado (numérico) para o onChange
  const handleValueChange = (values: { formattedValue: string; value: string }) => {
    // Passamos o valor não-formatado para ser usado em cálculos
    // Este é o valor numérico puro como string (sem formatação)
    onValueChange(values.value);
    
    console.log('[CurrencyInput] Valor formatado:', values.formattedValue);
    console.log('[CurrencyInput] Valor numérico:', values.value);
  };

  return (
    <NumericFormat
      customInput={Input}
      value={stringValue}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={decimalScale}
      fixedDecimalScale
      className={cn(className)}
      allowNegative={false}
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      {...props}
    />
  );
}
