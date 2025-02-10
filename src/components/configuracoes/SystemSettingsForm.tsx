
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  notificacoes: z.object({
    email_faturas: z.boolean(),
    email_pagamentos: z.boolean(),
  }),
  relatorios: z.object({
    incluir_logo: z.boolean(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Cooperativa = {
  id: string;
  configuracoes: FormValues;
};

export function SystemSettingsForm() {
  const { toast } = useToast();

  const { data: cooperativa, isLoading } = useQuery({
    queryKey: ["cooperativa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperativas")
        .select("id, configuracoes")
        .single();

      if (error) throw error;
      return data as Cooperativa;
    },
  });

  const defaultValues: FormValues = {
    notificacoes: {
      email_faturas: cooperativa?.configuracoes?.notificacoes?.email_faturas ?? true,
      email_pagamentos: cooperativa?.configuracoes?.notificacoes?.email_pagamentos ?? true,
    },
    relatorios: {
      incluir_logo: cooperativa?.configuracoes?.relatorios?.incluir_logo ?? true,
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!cooperativa?.id) throw new Error("Cooperativa não encontrada");
      
      const { error } = await supabase
        .from("cooperativas")
        .update({ configuracoes: values })
        .eq("id", cooperativa.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do sistema foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notificações por Email</h3>
              
              <FormField
                control={form.control}
                name="notificacoes.email_faturas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Notificações de Faturas
                      </FormLabel>
                      <FormDescription>
                        Receba notificações quando novas faturas forem geradas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificacoes.email_pagamentos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Notificações de Pagamentos
                      </FormLabel>
                      <FormDescription>
                        Receba notificações sobre pagamentos realizados
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Relatórios</h3>
              
              <FormField
                control={form.control}
                name="relatorios.incluir_logo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Incluir Logo nos Relatórios
                      </FormLabel>
                      <FormDescription>
                        Adiciona automaticamente a logo da cooperativa em relatórios gerados
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
