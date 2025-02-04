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

const unidadeFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(1, "UF é obrigatória"),
  cep: z.string().min(1, "CEP é obrigatório"),
  titular_id: z.string().min(1, "Titular é obrigatório"),
});

type UnidadeFormData = z.infer<typeof unidadeFormSchema>;

interface UnidadeWizardFormProps {
  sessionId: string;
  investidorId: string;
  onNext: (unidadeId: string) => void;
}

export function UnidadeWizardForm({ sessionId, investidorId, onNext }: UnidadeWizardFormProps) {
  const { toast } = useToast();
  const form = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeFormSchema),
    defaultValues: {
      numero_uc: "",
      logradouro: "",
      numero: "",
      complemento: "",
      cidade: "",
      uf: "",
      cep: "",
      titular_id: investidorId,
    },
  });

  const onSubmit = async (data: UnidadeFormData) => {
    try {
      const { data: unidade, error } = await supabase
        .from("unidades_usina")
        .insert({
          numero_uc: data.numero_uc,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          cidade: data.cidade,
          uf: data.uf,
          cep: data.cep,
          titular_id: data.titular_id,
          status: 'draft',
          session_id: sessionId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Unidade criada com sucesso!",
      });
      
      onNext(unidade.id);
    } catch (error: any) {
      console.error("Error saving unidade:", error);
      toast({
        title: "Erro ao salvar unidade",
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
          name="numero_uc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número UC</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logradouro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF</FormLabel>
              <FormControl>
                <Input {...field} maxLength={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input {...field} />
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