
/**
 * Componente para formatar e exibir valores monetários nas faturas
 * 
 * Este componente formata valores monetários para exibição na tabela
 * de faturas em formato brasileiro (R$).
 */

interface ValoresFaturaProps {
  valor: number;
}

export function ValorFatura({ valor }: ValoresFaturaProps) {
  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="text-right">
      <span>{formatCurrency(valor || 0)}</span>
    </div>
  );
}
