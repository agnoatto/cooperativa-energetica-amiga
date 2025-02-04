import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";

const usinaFormSchema = z.object({
  investidor_id: z.string().min(1, "Investidor é obrigatório"),
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
  dados_pagamento_nome: z.string().optional(),
  dados_pagamento_documento: z.string().optional(),
  dados_pagamento_banco: z.string().optional(),
  dados_pagamento_agencia: z.string().optional(),
  dados_pagamento_conta: z.string().optional(),
  dados_pagamento_telefone: z.string().optional(),
  dados_pagamento_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type UsinaFormData = z.infer<typeof usinaFormSchema>;

interface UsinaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usinaId?: string;
  onSuccess: () => void;
}

export function UsinaForm({
  open,
  onOpenChange,
  usinaId,
  onSuccess,
}: UsinaFormProps) {
  const { toast } = useToast();
  const form = useForm<UsinaFormData>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues: {
      investidor_id: "",
      unidade_usina_id: "",
      valor_kwh: 0,
      dados_pagamento_nome: "",
      dados_pagamento_documento: "",
      dados_pagamento_banco: "",
      dados_pagamento_agencia: "",
      dados_pagamento_conta: "",
      dados_pagamento_telefone: "",
      dados_pagamento_email: "",
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select(`
          id,
          numero_uc,
          logradouro,
          numero,
          complemento,
          cidade,
          uf,
          cep
        `)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  React.useEffect(() => {
    if (usinaId) {
      supabase
        .from("usinas")
        .select("*")
        .eq("id", usinaId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching usina:", error);
            return;
          }
          if (data) {
            form.reset(data);
          }
        });
    } else {
      form.reset({
        investidor_id: "",
        unidade_usina_id: "",
        valor_kwh: 0,
        dados_pagamento_nome: "",
        dados_pagamento_documento: "",
        dados_pagamento_banco: "",
        dados_pagamento_agencia: "",
        dados_pagamento_conta: "",
        dados_pagamento_telefone: "",
        dados_pagamento_email: "",
      });
    }
  }, [usinaId, form]);

  const onSubmit = async (data: UsinaFormData) => {
    try {
      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update({
            investidor_id: data.investidor_id,
            unidade_usina_id: data.unidade_usina_id,
            valor_kwh: data.valor_kwh,
            dados_pagamento_nome: data.dados_pagamento_nome,
            dados_pagamento_documento: data.dados_pagamento_documento,
            dados_pagamento_banco: data.dados_pagamento_banco,
            dados_pagamento_agencia: data.dados_pagamento_agencia,
            dados_pagamento_conta: data.dados_pagamento_conta,
            dados_pagamento_telefone: data.dados_pagamento_telefone,
            dados_pagamento_email: data.dados_pagamento_email,
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq("id", usinaId);
        if (error) throw error;
        toast({
          title: "Usina atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("usinas")
          .insert({
            investidor_id: data.investidor_id,
            unidade_usina_id: data.unidade_usina_id,
            valor_kwh: data.valor_kwh,
            dados_pagamento_nome: data.dados_pagamento_nome,
            dados_pagamento_documento: data.dados_pagamento_documento,
            dados_pagamento_banco: data.dados_pagamento_banco,
            dados_pagamento_agencia: data.dados_pagamento_agencia,
            dados_pagamento_conta: data.dados_pagamento_conta,
            dados_pagamento_telefone: data.dados_pagamento_telefone,
            dados_pagamento_email: data.dados_pagamento_email,
            status: 'draft'
          });
        if (error) throw error;
        toast({
          title: "Usina criada com sucesso!",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving usina:", error);
      toast({
        title: "Erro ao salvar usina",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatAddress = (unidade: any) => {
    const parts = [
      unidade.logradouro,
      unidade.numero,
      unidade.complemento,
      unidade.cidade,
      unidade.uf,
      unidade.cep,
    ].filter(Boolean);
    return `${unidade.numero_uc} - ${parts.join(", ")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{usinaId ? "Editar" : "Nova"} Usina</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="investidor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investidor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o investidor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {investidores?.map((investidor) => (
                          <SelectItem key={investidor.id} value={investidor.id}>
                            {investidor.nome_investidor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade_usina_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unidades?.map((unidade) => (
                          <SelectItem key={unidade.id} value={unidade.id}>
                            {formatAddress(unidade)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_kwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do kWh</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados de Pagamento</h3>
              
              <FormField
                control={form.control}
                name="dados_pagamento_nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dados_pagamento_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dados_pagamento_banco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dados_pagamento_agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dados_pagamento_conta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dados_pagamento_telefone"
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

                <FormField
                  control={form.control}
                  name="dados_pagamento_email"
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
              </div>
            </div>

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}