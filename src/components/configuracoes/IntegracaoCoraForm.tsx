
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
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Usuário não autenticado");

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("empresa_id")
        .eq("id", profile.user.id)
        .single();

      if (!userProfile?.empresa_id) throw new Error("Empresa não encontrada");

      const { data, error } = await supabase
        .from("integracao_cora")
        .select("*")
        .eq("empresa_id", userProfile.empresa_id)
        .maybeSingle();

      if (error) throw error;

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
      if (!configExistente?.empresa_id) {
        throw new Error("Empresa ID não encontrado");
      }

      const { error } = await supabase
        .from("integracao_cora")
        .upsert({
          ...values,
          empresa_id: configExistente.empresa_id,
        }, { onConflict: "empresa_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações da integração foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["integracao-cora"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
      console.error("Erro ao salvar configurações:", error);
    },
  });

  const onSubmit = (values: IntegracaoCoraFormValues) => {
    mutation.mutate(values);
  };

  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      const { error } = await supabase.functions.invoke("cora-auth", {
        method: "POST",
      });

      if (error) throw error;

      toast({
        title: "Conexão estabelecida",
        description: "A conexão com o Cora foi estabelecida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível estabelecer conexão com o Cora.",
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
