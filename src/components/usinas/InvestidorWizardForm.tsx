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
import InputMask from "react-input-mask";

const investidorFormSchema = z.object({
  nome_investidor: z.string().min(1, "Nome do investidor é obrigatório"),
  documento: z.string().min(14, "CPF/CNPJ é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
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
      nome_investidor: "",
      documento: "",
      telefone: "",
      email: "",
    },
  });

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      const { data: investidor, error } = await supabase
        .from("investidores")
        .insert({
          nome_investidor: data.nome_investidor,
          documento: data.documento.replace(/\D/g, ''),
          telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
          email: data.email || null,
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
          name="nome_investidor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Investidor</FormLabel>
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
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <div className="relative">
                  <InputMask
                    {...field}
                    mask={field.value.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
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
                <div className="relative">
                  <InputMask
                    {...field}
                    mask="(99) 99999-9999"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
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

        <Button type="submit">Próximo</Button>
      </form>
    </Form>
  );
}