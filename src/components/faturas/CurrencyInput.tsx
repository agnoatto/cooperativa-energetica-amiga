
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatToCurrency = (value: string): string => {
    // Remove tudo exceto números e vírgula
    let cleanValue = value.replace(/[^\d,]/g, '');
    
    // Garante apenas uma vírgula
    const parts = cleanValue.split(',');
    if (parts.length > 2) {
      cleanValue = parts[0] + ',' + parts[1];
    }

    // Trata a parte inteira (antes da vírgula)
    let integerPart = parts[0] || '';
    // Remove zeros à esquerda
    integerPart = integerPart.replace(/^0+/, '');
    if (!integerPart) integerPart = '0';

    // Adiciona separadores de milhar
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Trata a parte decimal (após a vírgula)
    let decimalPart = parts[1] || '';
    // Limita a 2 casas decimais
    decimalPart = decimalPart.slice(0, 2);
    // Completa com zeros se necessário
    while (decimalPart.length < 2) decimalPart += '0';

    // Monta o valor final
    return `R$ ${integerPart},${decimalPart}`;
  };

  const getNumericValue = (value: string): string => {
    // Remove tudo exceto números e vírgula
    return value.replace(/[^\d,]/g, '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const selectionStart = input.selectionStart || 0;
    const oldValue = input.value;
    let newValue = input.value;
    
    // Remove caracteres não permitidos mantendo a vírgula
    newValue = newValue.replace(/[^\d,]/g, '');
    
    // Calcula a diferença de comprimento entre o valor antigo e o novo
    // considerando apenas números e vírgula
    const oldNumericLength = getNumericValue(oldValue).length;
    const newNumericLength = newValue.length;
    
    // Formata o valor
    const formattedValue = formatToCurrency(newValue);
    
    // Atualiza o valor
    onChange(newValue);
    
    // Ajusta a posição do cursor
    requestAnimationFrame(() => {
      if (inputRef.current) {
        let newCursorPosition = selectionStart;
        
        // Ajusta o cursor baseado na diferença entre os valores numéricos
        if (newNumericLength > oldNumericLength) {
          // Adicionou dígito
          newCursorPosition += 1;
        } else if (newNumericLength < oldNumericLength) {
          // Removeu dígito
          newCursorPosition -= 1;
        }
        
        // Ajusta para a formatação R$
        if (newCursorPosition <= 3) {
          newCursorPosition = 3;
        }
        
        // Considera os separadores de milhar
        const countSeparatorsBefore = (formattedValue.slice(3, newCursorPosition).match(/\./g) || []).length;
        newCursorPosition += countSeparatorsBefore;
        
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    });
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      value={formatToCurrency(value)}
      onChange={handleChange}
    />
  );
}
