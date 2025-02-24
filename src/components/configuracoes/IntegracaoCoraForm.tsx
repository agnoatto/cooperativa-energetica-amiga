
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface IntegracaoCoraDB {
  id?: string;
  created_at?: string;
  updated_at?: string;
  empresa_id: string;
  client_id: string;
  client_secret: string;
  ambiente: "sandbox" | "production";
  configuracoes_boleto: Record<string, any>;
}

const integracaoCoraSchema = z.object({
  client_id: z.string().min(1, "Client ID é obrigatório"),
  client_secret: z.string().min(1, "Client Secret é obrigatório"),
  ambiente: z.enum(["sandbox", "production"]),
  configuracoes_boleto: z.object({
    instrucoes: z.array(z.string()),
    multa: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
    }),
    juros: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
    }),
    desconto: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
      data_limite: z.string().nullable(),
    }),
  }),
});

type IntegracaoCoraFormValues = z.infer<typeof integracaoCoraSchema>;

export function IntegracaoCoraForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Buscar configurações existentes e perfil do usuário
  const { data: configExistente, isLoading } = useQuery({
    queryKey: ["integracao-cora"],
    queryFn: async () => {
      console.log("Buscando configurações do Cora...");
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) {
        console.error("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("empresa_id")
        .eq("id", profile.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw new Error("Erro ao buscar perfil do usuário");
      }

      if (!userProfile?.empresa_id) {
        console.error("Empresa não encontrada");
        throw new Error("Empresa não encontrada");
      }

      const { data, error } = await supabase
        .from("integracao_cora")
        .select("*")
        .eq("empresa_id", userProfile.empresa_id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar configurações:", error);
        throw error;
      }

      return {
        ...data,
        empresa_id: userProfile.empresa_id,
      };
    },
  });

  const form = useForm<IntegracaoCoraFormValues>({
    resolver: zodResolver(integracaoCoraSchema),
    defaultValues: {
      ambiente: "sandbox",
      configuracoes_boleto: {
        instrucoes: [],
        multa: {
          percentual: 2,
          valor: 0,
        },
        juros: {
          percentual: 1,
          valor: 0,
        },
        desconto: {
          percentual: 0,
          valor: 0,
          data_limite: null,
        },
      },
    },
  });

  // Atualizar form quando dados forem carregados
  React.useEffect(() => {
    if (configExistente) {
      console.log("Atualizando formulário com configurações existentes:", configExistente);
      const { configuracoes_boleto, ...rest } = configExistente;
      form.reset({
        ...rest,
        configuracoes_boleto: typeof configuracoes_boleto === 'string' 
          ? JSON.parse(configuracoes_boleto)
          : configuracoes_boleto
      });
    }
  }, [configExistente, form]);

  const mutation = useMutation({
    mutationFn: async (values: IntegracaoCoraFormValues) => {
      console.log("Salvando configurações:", values);
      if (!configExistente?.empresa_id) {
        throw new Error("Empresa ID não encontrado");
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
        .upsert(dbData, { onConflict: "empresa_id" });

      if (error) {
        console.error("Erro ao salvar no banco:", error);
        throw error;
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
      console.error("Erro detalhado ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: `Erro ao salvar as configurações: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: IntegracaoCoraFormValues) => {
    mutation.mutate(values);
  };

  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      console.log("Testando conexão com o Cora...");
      
      const { error, data } = await supabase.functions.invoke("cora-auth", {
        method: "POST",
      });

      if (error) {
        console.error("Erro ao testar conexão:", error);
        throw error;
      }

      if (data.error) {
        console.error("Erro retornado pela API:", data.error);
        throw new Error(data.error);
      }

      console.log("Resposta do teste de conexão:", data);

      toast({
        title: "Conexão estabelecida",
        description: "A conexão com o Cora foi estabelecida com sucesso.",
      });
    } catch (error) {
      console.error("Erro detalhado ao testar conexão:", error);
      toast({
        title: "Erro na conexão",
        description: `Não foi possível estabelecer conexão com o Cora: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="ambiente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ambiente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ambiente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Ambiente sandbox para testes ou produção para transações reais
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Client ID fornecido pelo Cora
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Client Secret fornecido pelo Cora
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="configuracoes_boleto.multa.percentual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentual de Multa (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="configuracoes_boleto.juros.percentual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentual de Juros ao mês (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={testConnection}
            disabled={isTestingConnection}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              "Testar Conexão"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
