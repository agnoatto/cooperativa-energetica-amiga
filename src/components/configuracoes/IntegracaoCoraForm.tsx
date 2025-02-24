import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ConfiguracoesBoletoFields } from "./components/ConfiguracoesBoletoFields";
import { useIntegracaoCora } from "./hooks/useIntegracaoCora";
import { integracaoCoraSchema, IntegracaoCoraFormValues } from "./types/integracao-cora";

export function IntegracaoCoraForm() {
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { integracao, isLoading, saveIntegracao, isPending } = useIntegracaoCora();

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

  React.useEffect(() => {
    if (integracao) {
      console.log("Atualizando formulário com configurações existentes:", integracao);
      const { configuracoes_boleto, ...rest } = integracao;
      form.reset({
        ...rest,
        configuracoes_boleto: typeof configuracoes_boleto === 'string' 
          ? JSON.parse(configuracoes_boleto)
          : configuracoes_boleto
      });
    }
  }, [integracao, form]);

  const onSubmit = (values: IntegracaoCoraFormValues) => {
    saveIntegracao(values);
  };

  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      console.log("Iniciando teste de conexão com o Cora...");
      
      const { data, error } = await supabase.functions.invoke("cora-auth", {
        method: "POST",
      });

      if (error || (data && data.error)) {
        const errorMessage = data?.error || error?.message || "Erro desconhecido";
        console.error("Erro no teste de conexão:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Resposta do teste de conexão:", data);

      toast({
        title: "Conexão estabelecida",
        description: "A conexão com o Cora foi estabelecida com sucesso.",
      });
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      toast({
        title: "Erro na conexão",
        description: error.message || "Não foi possível estabelecer conexão com o Cora",
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

          <ConfiguracoesBoletoFields form={form} />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
