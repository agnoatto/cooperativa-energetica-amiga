
/**
 * Componente para exibir o número da Unidade Consumidora
 * 
 * Responsável pela exibição formatada do número da UC na tabela de faturas.
 */

interface NumeroUCProps {
  numeroUC: string;
}

export function NumeroUC({ numeroUC }: NumeroUCProps) {
  return <div className="font-medium">{numeroUC}</div>;
}
