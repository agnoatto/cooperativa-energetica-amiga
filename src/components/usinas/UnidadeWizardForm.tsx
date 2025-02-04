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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const unidadeFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  titular_tipo: z.enum(["cooperado", "investidor"]),
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
      endereco: "",
      titular_tipo: "investidor",
      titular_id: investidorId,
    },
  });

  const onSubmit = async (data: UnidadeFormData) => {
    try {
      const { data: unidade, error } = await supabase
        .from("unidades_usina")
        .insert({
          ...data,
          status: 'draft',
          session_id: sessionId,
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
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="titular_tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Titular</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de titular" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cooperado">Cooperado</SelectItem>
                  <SelectItem value="investidor">Investidor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Próximo</Button>
      </form>
    </Form>
  );
}