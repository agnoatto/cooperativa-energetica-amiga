
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { IntegracaoCoraDB, IntegracaoCoraFormValues } from "../types/integracao-cora";

export function useIntegracaoCora() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configExistente, isLoading, error: loadError } = useQuery({
    queryKey: ["integracao-cora"],
    queryFn: async () => {
      console.log("Buscando configurações do Cora...");
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Erro de autenticação:", authError);
        throw new Error("Usuário não autenticado");
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("empresa_id")
        .eq("id", user.id)
        .single();

      if (profileError || !userProfile?.empresa_id) {
        console.error("Erro ao buscar perfil:", profileError);
        throw new Error("Empresa não encontrada para o usuário");
      }

      const { data: config, error: configError } = await supabase
        .from("integracao_cora")
        .select("*")
        .eq("empresa_id", userProfile.empresa_id)
        .maybeSingle();

      if (configError) {
        console.error("Erro ao buscar configurações:", configError);
        throw configError;
      }

      return {
        ...config,
        empresa_id: userProfile.empresa_id,
      };
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: IntegracaoCoraFormValues) => {
      if (!configExistente?.empresa_id) {
        throw new Error("Empresa não encontrada");
      }

      const dbData: IntegracaoCoraDB = {
        empresa_id: configExistente.empresa_id,
        client_id: values.client_id,
        client_secret: values.client_secret,
        ambiente: values.ambiente,
        configuracoes_boleto: values.configuracoes_boleto,
      };

      const { error } = await supabase
        .from("integracao_cora")
        .upsert(dbData, { 
          onConflict: "empresa_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Erro ao salvar configurações:", error);
        throw new Error(`Erro ao salvar: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações da integração foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["integracao-cora"] });
    },
    onError: (error) => {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Erro ao salvar as configurações",
        variant: "destructive",
      });
    },
  });

  return {
    configExistente,
    isLoading,
    loadError,
    mutation,
  };
}
