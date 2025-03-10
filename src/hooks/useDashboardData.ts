
import useSWR from 'swr';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DashboardData {
  totalCooperados: number;
  totalUsinas: number;
  faturasPendentes: number;
  totalPagamentos: number;
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    // Fetch total active cooperados
    const { count: totalCooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*', { count: 'exact', head: false })
      .is('data_exclusao', null);

    if (cooperadosError) {
      console.error('Error fetching cooperados:', cooperadosError);
      throw new Error('Erro ao buscar cooperados');
    }

    // Fetch total active usinas
    const { count: totalUsinas, error: usinasError } = await supabase
      .from('usinas')
      .select('*', { count: 'exact', head: false })
      .eq('status', 'active');

    if (usinasError) {
      console.error('Error fetching usinas:', usinasError);
      throw new Error('Erro ao buscar usinas');
    }

    // Fetch pending faturas for current month
    const { count: faturasPendentes, error: faturasError } = await supabase
      .from('faturas')
      .select('*', { count: 'exact', head: false })
      .eq('status', 'pendente')
      .eq('mes', currentMonth)
      .eq('ano', currentYear);

    if (faturasError) {
      console.error('Error fetching faturas:', faturasError);
      throw new Error('Erro ao buscar faturas');
    }

    // Fetch total payments for current month
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('faturas')
      .select('valor_assinatura')
      .eq('status', 'finalizada')
      .eq('mes', currentMonth)
      .eq('ano', currentYear);

    if (pagamentosError) {
      console.error('Error fetching pagamentos:', pagamentosError);
      throw new Error('Erro ao buscar pagamentos');
    }

    const totalPagamentos = pagamentos?.reduce((acc, curr) => acc + Number(curr.valor_assinatura), 0) || 0;

    return {
      totalCooperados: totalCooperados || 0,
      totalUsinas: totalUsinas || 0,
      faturasPendentes: faturasPendentes || 0,
      totalPagamentos,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const useDashboardData = () => {
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR<DashboardData>(
    'dashboardData',
    fetchDashboardData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Revalidate every 30 seconds
      onError: (err) => {
        console.error('Dashboard data error:', err);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};
