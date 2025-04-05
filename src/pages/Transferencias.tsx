
import React from 'react';
import { useTransferencias } from '@/hooks/contas-bancos/useTransferencias';

export default function Transferencias() {
  const { 
    transferencias, 
    isLoading, 
    fetchTransferencias 
  } = useTransferencias();

  React.useEffect(() => {
    // Carregar transferências
    fetchTransferencias();
  }, []);

  return (
    <div>
      <h1>Transferências Bancárias</h1>
      
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {transferencias.length === 0 ? (
            <p>Nenhuma transferência encontrada</p>
          ) : (
            <ul>
              {transferencias.map((transferencia) => (
                <li key={transferencia.id}>
                  {transferencia.descricao} - R$ {transferencia.valor}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <button onClick={fetchTransferencias}>
        Atualizar
      </button>
    </div>
  );
}
