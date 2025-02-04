import React from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const investidorFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  documento: z.string().min(1, "Documento é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  beneficiario_nome: z.string().optional(),
  beneficiario_documento: z.string().optional(),
  beneficiario_banco: z.string().optional(),
  beneficiario_agencia: z.string().optional(),
  beneficiario_conta: z.string().optional(),
  beneficiario_telefone: z.string().optional(),
  beneficiario_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type InvestidorFormData = z.infer<typeof investidorFormSchema>;

interface InvestidorWizardFormProps {
  sessionId: string;
  onNext: (investidorId: string) => void;
}

export function InvestidorWizardForm({ sessionId, onNext }: InvestidorWizardFormProps) {
  const { toast } = useToast();
  const form = useForm<InvestidorFormData>({
    resolver: zodResolver(investidorFormSchema),
    defaultValues: {
      nome: "",
      documento: "",
      telefone: "",
      email: "",
      beneficiario_nome: "",
      beneficiario_documento: "",
      beneficiario_banco: "",
      beneficiario_agencia: "",
      beneficiario_conta: "",
      beneficiario_telefone: "",
      beneficiario_email: "",
    },
  });

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      const { data: investidor, error } = await supabase
        .from("investidores")
        .insert({
          nome: data.nome,
          documento: data.documento,
          telefone: data.telefone || null,
          email: data.email || null,
          beneficiario_nome: data.beneficiario_nome || null,
          beneficiario_documento: data.beneficiario_documento || null,
          beneficiario_banco: data.beneficiario_banco || null,
          beneficiario_agencia: data.beneficiario_agencia || null,
          beneficiario_conta: data.beneficiario_conta || null,
          beneficiario_telefone: data.beneficiario_telefone || null,
          beneficiario_email: data.beneficiario_email || null,
          status: 'draft',
          session_id: sessionId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Investidor criado com sucesso!",
      });
      
      onNext(investidor.id);
    } catch (error: any) {
      console.error("Error saving investidor:", error);
      toast({
        title: "Erro ao salvar investidor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
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
          name="documento"
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados do Beneficiário</h3>

          <FormField
            control={form.control}
            name="beneficiario_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Beneficiário</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="beneficiario_documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento do Beneficiário</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="beneficiario_banco"
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
            name="beneficiario_agencia"
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

          <FormField
            control={form.control}
            name="beneficiario_conta"
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

          <FormField
            control={form.control}
            name="beneficiario_telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone do Beneficiário</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="beneficiario_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do Beneficiário</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Próximo</Button>
      </form>
    </Form>
  );
}