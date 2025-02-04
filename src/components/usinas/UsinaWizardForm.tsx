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

const usinaFormSchema = z.object({
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
});

type UsinaFormData = z.infer<typeof usinaFormSchema>;

interface UsinaWizardFormProps {
  sessionId: string;
  investidorId: string;
  unidadeId: string;
  onComplete: () => void;
}

export function UsinaWizardForm({ 
  sessionId, 
  investidorId, 
  unidadeId, 
  onComplete 
}: UsinaWizardFormProps) {
  const { toast } = useToast();
  const form = useForm<UsinaFormData>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues: {
      valor_kwh: 0,
    },
  });

  const onSubmit = async (data: UsinaFormData) => {
    try {
      // Create the usina
      const { error: usinaError } = await supabase
        .from("usinas")
        .insert({
          investidor_id: investidorId,
          unidade_usina_id: unidadeId,
          valor_kwh: data.valor_kwh,
          status: 'draft',
          session_id: sessionId,
        });

      if (usinaError) throw usinaError;

      // Update status of all draft records to active
      await Promise.all([
        supabase
          .from("investidores")
          .update({ status: 'active', session_id: null })
          .eq('session_id', sessionId),
        supabase
          .from("unidades_usina")
          .update({ status: 'active', session_id: null })
          .eq('session_id', sessionId),
        supabase
          .from("usinas")
          .update({ status: 'active', session_id: null })
          .eq('session_id', sessionId),
      ]);
      
      toast({
        title: "Usina criada com sucesso!",
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Error saving usina:", error);
      toast({
        title: "Erro ao salvar usina",
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

        <Button type="submit">Concluir</Button>
      </form>
    </Form>
  );
}