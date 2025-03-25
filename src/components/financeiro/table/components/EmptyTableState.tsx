
/**
 * Componente de estado vazio para tabela de lançamentos
 * 
 * Exibe uma mensagem quando não há lançamentos para exibir na tabela
 */
export function EmptyTableState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
      <h3 className="text-lg font-semibold">Nenhum lançamento encontrado</h3>
      <p className="text-sm text-gray-500">
        Não existem lançamentos cadastrados para os filtros selecionados.
      </p>
    </div>
  );
}
