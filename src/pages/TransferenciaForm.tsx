import React from 'react';
import { useTransferencias } from '@/hooks/contas-bancos/useTransferencias';

export default function TransferenciaForm() {
  const { 
    salvarTransferencia, 
    isLoading 
  } = useTransferencias();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui nós usaremos salvarTransferencia, não realizarTransferencia
    await salvarTransferencia({
      descricao: "Nova transferência",
      valor: 1000,
      data_transferencia: new Date().toISOString(),
      status: "pendente"
    });
  };

  return (
    <div>
      <h1>Formulário de Transferência</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
