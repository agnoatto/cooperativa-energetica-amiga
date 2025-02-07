
import React from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    
    // Remove tudo exceto números e vírgula
    value = value.replace(/[^\d,]/g, '');
    
    // Garante apenas uma vírgula
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts[1];
    }
    
    // Limita decimais a 2 dígitos
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + ',' + parts[1].slice(0, 2);
    }

    onChange(value);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return '';
    
    // Remove caracteres não numéricos exceto vírgula
    let numericValue = value.replace(/[^\d,]/g, '');
    
    // Converte vírgula para ponto para fazer o parse
    const numberValue = parseFloat(numericValue.replace(',', '.')) || 0;
    
    // Formata para o padrão brasileiro
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Input
      {...props}
      type="text"
      value={formatDisplayValue(value)}
      onChange={handleChange}
    />
  );
}
