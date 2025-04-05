
/**
 * Hook para gerenciar contas bancárias
 * 
 * Este hook fornece acesso à lista de contas bancárias com filtros
 * e funcionalidades para listar, buscar e atualizar contas.
 */
import { useState, useEffect } from "react";
import { ContaBancaria, TipoContaBancaria } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseContasBancariasParams {
  busca?: string;
  tipo?: TipoContaBancaria;
  status?: string;
}

// Mock temporário até implementarmos a integração completa com o Supabase
const contasMock: ContaBancaria[] = [
  {
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
  {
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
  },
  {
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
  },
  {
    id: "4",
    nome: "Investimentos",
    tipo: "investimento",
    status: "ativa",
    banco: "Banco XP",
    agencia: "0001",
    conta: "12345",
    digito: "6",
    saldo_atual: 50000.00,
    saldo_inicial: 40000.00,
    data_saldo_inicial: "2024-01-01",
    cor: "#8b5cf6",
    empresa_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "5",
    nome: "Conta Inativa",
    tipo: "corrente",
    status: "inativa",
    banco: "Santander",
    agencia: "5678",
    conta: "98765",
    digito: "4",
    saldo_atual: 0.00,
    saldo_inicial: 5000.00,
    data_saldo_inicial: "2023-06-01",
    cor: "#6b7280",
    empresa_id: "1",
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z",
  },
];

export function useContasBancarias(params: UseContasBancariasParams = {}) {
  const { busca = "", tipo, status } = params;
  const [data, setData] = useState<ContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de busca com filtros
      // Aqui você implementaria a lógica real com Supabase quando estiver pronto
      setTimeout(() => {
        let contas = [...contasMock];
        
        // Aplicar filtros
        if (busca) {
          const termoBusca = busca.toLowerCase();
          contas = contas.filter(conta => 
            conta.nome.toLowerCase().includes(termoBusca) || 
            conta.banco?.toLowerCase().includes(termoBusca) ||
            conta.agencia?.toLowerCase().includes(termoBusca) ||
            conta.conta?.toLowerCase().includes(termoBusca)
          );
        }
        
        if (tipo) {
          contas = contas.filter(conta => conta.tipo === tipo);
        }
        
        if (status) {
          contas = contas.filter(conta => conta.status === status);
        }
        
        setData(contas);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Erro ao buscar contas bancárias:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar contas"));
      setIsLoading(false);
      toast.error("Erro ao buscar contas bancárias");
    }
  };

  useEffect(() => {
    fetchContas();
  }, [busca, tipo, status]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchContas,
  };
}
