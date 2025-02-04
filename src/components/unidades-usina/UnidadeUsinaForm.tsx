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

const unidadeUsinaFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  titular_id: z.string().min(1, "Titular é obrigatório"),
  titular_tipo: z.enum(["cooperado", "investidor"] as const, {
    required_error: "Tipo de titular é obrigatório",
  }),
});

type UnidadeUsinaFormData = z.infer<typeof unidadeUsinaFormSchema>;

interface UnidadeUsinaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadeId?: string;
  onSuccess: () => void;
}

export function UnidadeUsinaForm({
  open,
  onOpenChange,
  unidadeId,
  onSuccess,
}: UnidadeUsinaFormProps) {
  const { toast } = useToast();
  const form = useForm<UnidadeUsinaFormData>({
    resolver: zodResolver(unidadeUsinaFormSchema),
    defaultValues: {
      numero_uc: "",
      endereco: "",
      titular_id: "",
      titular_tipo: "cooperado",
    },
  });

  const { data: cooperados } = useQuery({
    queryKey: ["cooperados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperados")
        .select("id, nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome");
      if (error) throw error;
      return data;
    },
  });

  React.useEffect(() => {
    if (unidadeId) {
      supabase
        .from("unidades_usina")
        .select("*")
        .eq("id", unidadeId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching unidade:", error);
            return;
          }
          if (data) {
            // Garantir que titular_tipo seja do tipo correto
            const formData: UnidadeUsinaFormData = {
              numero_uc: data.numero_uc,
              endereco: data.endereco,
              titular_id: data.titular_id,
              titular_tipo: data.titular_tipo as "cooperado" | "investidor",
            };
            form.reset(formData);
          }
        });
    } else {
      form.reset({
        numero_uc: "",
        endereco: "",
        titular_id: "",
        titular_tipo: "cooperado",
      });
    }
  }, [unidadeId, form]);

  const onSubmit = async (data: UnidadeUsinaFormData) => {
    try {
      const submitData = {
        numero_uc: data.numero_uc,
        endereco: data.endereco,
        titular_id: data.titular_id,
        titular_tipo: data.titular_tipo,
        updated_at: new Date().toISOString(),
      };

      if (unidadeId) {
        const { error } = await supabase
          .from("unidades_usina")
          .update(submitData)
          .eq("id", unidadeId);
        if (error) throw error;
        toast({
          title: "Unidade atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("unidades_usina")
          .insert({
            ...submitData,
            status: 'draft',
            session_id: crypto.randomUUID(),
          });
        if (error) throw error;
        toast({
          title: "Unidade criada com sucesso!",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving unidade:", error);
      toast({
        title: "Erro ao salvar unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const titularTipo = form.watch("titular_tipo");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {unidadeId ? "Editar" : "Nova"} Unidade da Usina
          </DialogTitle>
        </DialogHeader>

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={form.control}
              name="titular_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titular</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o titular" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {titularTipo === "cooperado"
                        ? cooperados?.map((cooperado) => (
                            <SelectItem key={cooperado.id} value={cooperado.id}>
                              {cooperado.nome}
                            </SelectItem>
                          ))
                        : investidores?.map((investidor) => (
                            <SelectItem key={investidor.id} value={investidor.id}>
                              {investidor.nome}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
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