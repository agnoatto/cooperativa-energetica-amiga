
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
 * 
 * IMPORTANTE: Este componente transmite o valor como número decimal (floatValue),
 * já convertido do formato brasileiro (1.234,56) para o formato numérico (1234.56).
 */
export type CurrencyInputProps = {
  value: number | string;
  onValueChange: (value: number) => void;
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
  
  // Converte para string se for número (para exibição)
  const displayValue = typeof value === 'number' ? value.toString() : value;
  
  const handleValueChange = (values: { formattedValue: string; value: string; floatValue: number | undefined }) => {
    // Passamos o floatValue (já com ponto decimal) para o onChange
    // Se floatValue for undefined, usamos 0 como fallback
    onValueChange(values.floatValue ?? 0);
    
    console.log('[CurrencyInput] Valor original:', value);
    console.log('[CurrencyInput] Valor formatado:', values.formattedValue);
    console.log('[CurrencyInput] Valor float:', values.floatValue);
  };

  return (
    <NumericFormat
      customInput={Input}
      value={displayValue}
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
