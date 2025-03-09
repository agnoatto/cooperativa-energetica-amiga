
import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Componente para entrada de valores monetários no formato brasileiro (R$)
 * 
 * Este componente permite a entrada de valores monetários seguindo o padrão brasileiro,
 * com separador de milhar (.) e separador decimal (,). Ele converte automaticamente
 * os valores digitados para o formato numérico que pode ser usado em cálculos.
 */
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
  
  const handleValueChange = (values: { formattedValue: string; value: string; floatValue: number | undefined }) => {
    // Passamos o valor numérico como string, sem formatação
    onValueChange(values.value);
    
    console.log('[CurrencyInput] Valor original:', value);
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
