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

const usinaFormSchema = z.object({
  investidor_id: z.string().min(1, "Investidor é obrigatório"),
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
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
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor");
      if (error) throw error;
      return data;
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select("id, numero_uc");
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
      });
    }
  }, [usinaId, form]);

  const onSubmit = async (data: UsinaFormData) => {
    try {
      const submitData = {
        investidor_id: data.investidor_id,
        unidade_usina_id: data.unidade_usina_id,
        valor_kwh: data.valor_kwh,
        updated_at: new Date().toISOString(),
      };

      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update(submitData)
          .eq("id", usinaId);
        if (error) throw error;
        toast({
          title: "Usina atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("usinas")
          .insert({
            ...submitData,
            status: 'draft',
            session_id: crypto.randomUUID(),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{usinaId ? "Editar" : "Nova"} Usina</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          {unidade.numero_uc}
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

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}