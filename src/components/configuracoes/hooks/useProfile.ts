import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

export const profileFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cargo: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileWithRole {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cargo?: string | null;
  avatar_url?: string | null;
  cooperativa_id?: string | null;
  user_roles?: Array<{role: 'master' | 'user'}>;
  role?: 'master' | 'user';
}

export function useProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Buscar perfil e role do usuário
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*, user_roles!inner(role)")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const profileWithRole: ProfileWithRole = {
        ...profile,
        role: profile.user_roles?.[0]?.role || 'user'
      };

      return profileWithRole;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: mutation.mutate,
    isPending: mutation.isPending,
  };
}
