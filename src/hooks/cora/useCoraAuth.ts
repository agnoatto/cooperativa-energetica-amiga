
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoraAuthResponse, CoraError } from '@/types/cora';

export const useCoraAuth = () => {
  return useQuery({
    queryKey: ['cora-auth'],
    queryFn: async (): Promise<CoraAuthResponse> => {
      const { data, error } = await supabase.functions.invoke<CoraAuthResponse>('cora-auth', {
        method: 'POST',
      });

      if (error) {
        console.error('Error authenticating with Cora:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Cora authentication');
      }

      return data;
    },
    staleTime: 55 * 60 * 1000, // Considerar token válido por 55 minutos (5 minutos antes de expirar)
    retry: 2,
  });
};
