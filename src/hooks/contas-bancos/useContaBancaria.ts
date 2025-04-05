
/**
 * Hook para gerenciar uma conta bancária individual
 * 
 * Este hook fornece funcionalidades para buscar, criar, atualizar
 * e excluir uma conta bancária específica.
 */
import { useState, useEffect } from "react";
import { ContaBancaria } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
];

export function useContaBancaria(id?: string) {
  const [data, setData] = useState<ContaBancaria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConta = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de busca por ID
      // Aqui você implementaria a lógica real com Supabase quando estiver pronto
      setTimeout(() => {
        const conta = contasMock.find(c => c.id === id) || null;
        setData(conta);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Erro ao buscar conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar conta"));
      setIsLoading(false);
      toast.error("Erro ao buscar conta bancária");
    }
  };

  const salvarContaBancaria = async (contaData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de salvamento
      // Aqui você implementaria a lógica real com Supabase quando estiver pronto
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se for uma atualização
      if (id) {
        console.log("Dados para atualizar:", { id, ...contaData });
        return true;
      }
      
      // Se for uma nova conta
      console.log("Dados para criar:", contaData);
      return true;

    } catch (err) {
      console.error("Erro ao salvar conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao salvar conta"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const excluirContaBancaria = async (contaId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de exclusão
      // Aqui você implementaria a lógica real com Supabase quando estiver pronto
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Excluindo conta:", contaId);
      return true;

    } catch (err) {
      console.error("Erro ao excluir conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao excluir conta"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConta();
    }
  }, [id]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchConta,
    salvarContaBancaria,
    excluirContaBancaria,
  };
}
