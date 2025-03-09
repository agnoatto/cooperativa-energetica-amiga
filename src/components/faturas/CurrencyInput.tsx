
import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Definindo um tipo específico para as props do CurrencyInput
export type CurrencyInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function CurrencyInput({ 
  value, 
  onValueChange, 
  className, 
  disabled,
  placeholder,
  id,
  ...props 
}: CurrencyInputProps & Omit<NumericFormatProps, 'value' | 'onValueChange' | 'customInput'>) {
  // Adicionamos mais logs detalhados para diagnóstico
  const handleValueChange = (values: { formattedValue: string; value: string; floatValue: number }) => {
    // Passamos o valor não-formatado para ser usado em cálculos
    // Este é o valor numérico puro como string (sem formatação)
    onValueChange(values.value);
    
    console.log('[CurrencyInput] Input original:', value);
    console.log('[CurrencyInput] Valor formatado:', values.formattedValue);
    console.log('[CurrencyInput] Valor numérico (string):', values.value);
    console.log('[CurrencyInput] Valor float:', values.floatValue);
  };

  return (
    <NumericFormat
      customInput={Input}
      value={value}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
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
