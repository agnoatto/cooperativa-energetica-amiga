
/**
 * Hook para ordenação de unidades
 * 
 * Este hook gerencia a lógica de ordenação das unidades beneficiárias,
 * permitindo ordenar por diferentes campos e alternar entre ordenação
 * ascendente, descendente ou sem ordenação.
 */
import { useMemo, useState } from "react";

// Define tipos para a ordenação
export type SortDirection = 'asc' | 'desc' | null;
export type SortField = 'numero_uc' | 'apelido' | 'endereco' | 'percentual_desconto' | 'consumo_kwh' | 'data_entrada' | 'status';

export function useUnidadesSorting(unidades: any[]) {
  // Estado para ordenação
  const [sortField, setSortField] = useState<SortField>('numero_uc');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Se já estiver ordenando por este campo, alterne a direção ou remova a ordenação
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      // Se estiver mudando o campo, inicie com ordenação ascendente
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Função de ordenação para diferentes tipos de dados
  const sortData = (a: any, b: any, field: SortField, direction: SortDirection) => {
    if (direction === null) return 0;

    const multiplier = direction === 'asc' ? 1 : -1;

    // Se for o campo status, comparamos pelo atributo data_saida
    if (field === 'status') {
      const aIsActive = a.data_saida === null;
      const bIsActive = b.data_saida === null;
      return aIsActive === bIsActive ? 0 : aIsActive ? -multiplier : multiplier;
    }

    // Campos numéricos
    if (field === 'percentual_desconto' || field === 'consumo_kwh') {
      return (a[field] - b[field]) * multiplier;
    }

    // Campos de data
    if (field === 'data_entrada') {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return (dateA.getTime() - dateB.getTime()) * multiplier;
    }

    // Campos de texto, por padrão
    const valA = a[field]?.toString().toLowerCase() || '';
    const valB = b[field]?.toString().toLowerCase() || '';
    return valA.localeCompare(valB) * multiplier;
  };

  // Unidades ordenadas usando useMemo para evitar recálculos desnecessários
  const sortedUnidades = useMemo(() => {
    if (!sortDirection) return unidades;
    
    return [...unidades].sort((a, b) => sortData(a, b, sortField, sortDirection));
  }, [unidades, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedUnidades
  };
}
