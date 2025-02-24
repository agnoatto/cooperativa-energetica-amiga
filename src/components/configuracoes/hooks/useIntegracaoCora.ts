
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { IntegracaoCoraFormValues } from "../types/integracao-cora";

export function useIntegracaoCora() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["integracao-cora"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("cooperativa_id")
        .eq("id", user.id)
        .single();

      if (!profile?.cooperativa_id) return null;

      const { data: integracao } = await supabase
        .from("integracao_cora")
        .select("*")
        .eq("empresa_id", profile.cooperativa_id)
        .single();

      return integracao;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: IntegracaoCoraFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: profile } = await supabase
        .from("profiles")
        .select("cooperativa_id")
        .eq("id", user.id)
        .single();

      if (!profile?.cooperativa_id) throw new Error("Usuário sem cooperativa vinculada");

      const insertData = {
        ...values,
        empresa_id: profile.cooperativa_id,
        client_id: values.client_id || '',
        client_secret: values.client_secret || '',
      };

      const { error } = await supabase
        .from("integracao_cora")
        .upsert(insertData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integracao-cora"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações da integração foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    integracao: query.data,
    isLoading: query.isLoading,
    saveIntegracao: mutation.mutate,
    isPending: mutation.isPending,
  };
}
