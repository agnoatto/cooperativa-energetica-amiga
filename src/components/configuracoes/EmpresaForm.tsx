import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { EmpresaFormData } from "@/types/empresa";

const empresaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  razao_social: z.string().min(1, "Razão social é obrigatória"),
  documento: z.string().min(14, "CNPJ inválido"),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  tipo_empresa: z.string().default("cooperativa"),
  data_fundacao: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  telefone: z.string().optional(),
});

export function EmpresaForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: empresa, isLoading } = useQuery({
    queryKey: ["empresa-atual"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: profile } = await supabase
        .from("profiles")
        .select("cooperativa_id")
        .eq("id", user.id)
        .single();

      if (!profile?.cooperativa_id) return null;

      const { data: empresa } = await supabase
        .from("empresas")
        .select("*")
        .eq("id", profile.cooperativa_id)
        .single();

      return empresa;
    },
  });

  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresa || {
      tipo_empresa: "cooperativa",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: EmpresaFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (empresa?.id) {
        const { error } = await supabase
          .from("empresas")
          .update(values)
          .eq("id", empresa.id);

        if (error) throw error;
        return empresa.id;
      }

      const { data, error: createError } = await supabase
        .from("empresas")
        .insert(values)
        .select()
        .single();

      if (createError) throw createError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cooperativa_id: data.id })
        .eq("id", user.id);

      if (updateError) throw updateError;

      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresa-atual"] });
      toast({
        title: empresa?.id ? "Empresa atualizada" : "Empresa cadastrada",
        description: empresa?.id 
          ? "Os dados da empresa foram atualizados com sucesso"
          : "Sua empresa foi cadastrada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: EmpresaFormData) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="razao_social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inscricao_estadual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição Estadual</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inscricao_municipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição Municipal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : empresa?.id ? (
              "Atualizar Empresa"
            ) : (
              "Cadastrar Empresa"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
