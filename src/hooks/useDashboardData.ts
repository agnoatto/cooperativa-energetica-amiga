
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch total active cooperados
  const { count: totalCooperados } = await supabase
    .from('cooperados')
    .select('*', { count: 'exact', head: true })
    .is('data_exclusao', null);

  // Fetch total active usinas
  const { count: totalUsinas } = await supabase
    .from('usinas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Fetch pending faturas for current month
  const { count: faturasPendentes } = await supabase
    .from('faturas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pendente')
    .eq('mes', currentMonth)
    .eq('ano', currentYear);

  // Fetch total payments for current month
  const { data: pagamentos } = await supabase
    .from('faturas')
    .select('valor_total')
    .eq('status', 'paga')
    .eq('mes', currentMonth)
    .eq('ano', currentYear);

  const totalPagamentos = pagamentos?.reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0;

  return {
    totalCooperados: totalCooperados || 0,
    totalUsinas: totalUsinas || 0,
    faturasPendentes: faturasPendentes || 0,
    totalPagamentos,
  };
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });
};
