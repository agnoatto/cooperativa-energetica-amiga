
import React from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere que não seja número ou vírgula
    let newValue = event.target.value.replace(/[^\d,]/g, '');
    
    // Garante que só exista uma vírgula
    const parts = newValue.split(',');
    if (parts.length > 2) {
      newValue = parts[0] + ',' + parts[1];
    }

    // Se houver parte decimal, limita a 2 casas
    if (parts[1]) {
      newValue = parts[0] + ',' + parts[1].slice(0, 2);
    }

    onChange(newValue);
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      placeholder="0,00"
    />
  );
}
