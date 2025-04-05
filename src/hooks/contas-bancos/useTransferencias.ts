/**
 * Hook para gerenciar transferências bancárias
 * 
 * Este hook fornece funcionalidades para listar, filtrar e gerenciar
 * transferências entre contas bancárias.
 */
import { useState, useEffect } from "react";
import { 
  TransferenciaBancaria, 
  TipoTransferencia, 
  StatusTransferencia 
} from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseTransferenciasParams {
  busca?: string;
  tipo?: TipoTransferencia;
  status?: StatusTransferencia;
  dataInicio?: string;
  dataFim?: string;
  contaOrigemId?: string;
  contaDestinoId?: string;
}

// Mock temporário até implementarmos a integração completa com o Supabase
const transferenciaMock: TransferenciaBancaria[] = [
  {
    id: "1",
    conta_origem_id: "1",
    conta_destino_id: "2",
    valor: 1000,
    data_transferencia: "2024-04-01T10:30:00Z",
    data_conciliacao: "2024-04-01T10:35:00Z",
    status: "concluida",
    descricao: "Transferência para poupança",
    empresa_id: "1",
    created_at: "2024-04-01T10:30:00Z",
    updated_at: "2024-04-01T10:35:00Z",
    conta_origem: {
      id: "1",
      nome: "Conta Principal",
      tipo: "corrente",
      status: "ativa",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "56789",
      digito: "0",
      saldo_atual: 15420.50,
      saldo_inicial: 10000.00,
      data_saldo_inicial: "2024-01-01",
      cor: "#3b82f6",
      empresa_id: "1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
    },
    conta_destino: {
      id: "2",
      nome: "Poupança",
      tipo: "poupanca",
      status: "ativa",
      banco: "Caixa Econômica",
      agencia: "4321",
      conta: "98765",
      digito: "1",
      saldo_atual: 25000.00,
      saldo_inicial: 20000.00,
      data_saldo_inicial: "2024-01-01",
      cor: "#10b981",
      empresa_id: "1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
    }
  },
  {
    id: "2",
    conta_origem_id: "3",
    conta_destino_id: undefined,
    valor: 500.00,
    data_transferencia: "2024-04-02T14:20:00Z",
    status: "concluida",
    descricao: "Saque para pagamento de fornecedor",
    empresa_id: "1",
    created_at: "2024-04-02T14:20:00Z",
    updated_at: "2024-04-02T14:20:00Z",
    conta_origem: {
      id: "3",
      nome: "Caixa Interno",
      tipo: "caixa",
      status: "ativa",
      saldo_atual: 2500.00,
      saldo_inicial: 1000.00,
      data_saldo_inicial: "2024-01-01",
      cor: "#f59e0b",
      empresa_id: "1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
    }
  },
  {
    id: "3",
    conta_origem_id: "1",
    conta_destino_id: undefined,
    valor: 2000.00,
    data_transferencia: "2024-04-03T09:15:00Z",
    status: "pendente",
    descricao: "Transferência bancária para fornecedor",
    empresa_id: "1",
    created_at: "2024-04-03T09:15:00Z",
    updated_at: "2024-04-03T09:15:00Z",
    conta_origem: {
      id: "1",
      nome: "Conta Principal",
      tipo: "corrente",
      status: "ativa",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "56789",
      digito: "0",
      saldo_atual: 15420.50,
      saldo_inicial: 10000.00,
      data_saldo_inicial: "2024-01-01",
      cor: "#3b82f6",
      empresa_id: "1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
    }
  },
  {
    id: "4",
    conta_origem_id: undefined,
    conta_destino_id: "1",
    valor: 5000.00,
    data_transferencia: "2024-04-04T11:45:00Z",
    status: "concluida",
    descricao: "Depósito de cliente",
    empresa_id: "1",
    created_at: "2024-04-04T11:45:00Z",
    updated_at: "2024-04-04T11:50:00Z",
    conta_destino: {
      id: "1",
      nome: "Conta Principal",
      tipo: "corrente",
      status: "ativa",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "56789",
      digito: "0",
      saldo_atual: 15420.50,
      saldo_inicial: 10000.00,
      data_saldo_inicial: "2024-01-01",
      cor: "#3b82f6",
      empresa_id: "1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
    }
  },
];

export function useTransferencias(params: UseTransferenciasParams = {}) {
  const { 
    busca = "", 
    tipo, 
    status, 
    dataInicio, 
    dataFim,
    contaOrigemId,
    contaDestinoId
  } = params;
  
  const [data, setData] = useState<TransferenciaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransferencias = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de busca com filtros
      // Aqui você implementaria a lógica real com Supabase quando estiver pronto
      setTimeout(() => {
        let transferencias = [...transferenciaMock];
        
        // Aplicar filtros
        if (busca) {
          const termoBusca = busca.toLowerCase();
          transferencias = transferencias.filter(t => 
            t.descricao?.toLowerCase().includes(termoBusca) || 
            t.conta_origem?.nome.toLowerCase().includes(termoBusca) ||
            t.conta_destino?.nome.toLowerCase().includes(termoBusca)
          );
        }
        
        if (tipo) {
          transferencias = transferencias.filter(t => {
            if (tipo === 'interna') {
              return t.conta_origem_id && t.conta_destino_id;
            } else if (tipo === 'externa') {
              return t.conta_origem_id && !t.conta_destino_id;
            } else if (tipo === 'entrada') {
              return !t.conta_origem_id && t.conta_destino_id;
            } else if (tipo === 'saida') {
              return t.conta_origem_id && !t.conta_destino_id;
            }
            return true;
          });
        }
        
        if (status) {
          transferencias = transferencias.filter(t => t.status === status);
        }
        
        if (dataInicio) {
          transferencias = transferencias.filter(t => 
            new Date(t.data_transferencia) >= new Date(dataInicio)
          );
        }
        
        if (dataFim) {
          transferencias = transferencias.filter(t => 
            new Date(t.data_transferencia) <= new Date(dataFim)
          );
        }
        
        if (contaOrigemId) {
          transferencias = transferencias.filter(t => t.conta_origem_id === contaOrigemId);
        }
        
        if (contaDestinoId) {
          transferencias = transferencias.filter(t => t.conta_destino_id === contaDestinoId);
        }
        
        setData(transferencias);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Erro ao buscar transferências:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar transferências"));
      setIsLoading(false);
      toast.error("Erro ao buscar transferências");
    }
  };

  useEffect(() => {
    fetchTransferencias();
  }, [busca, tipo, status, dataInicio, dataFim, contaOrigemId, contaDestinoId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchTransferencias,
  };
}
