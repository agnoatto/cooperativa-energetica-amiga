
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
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { TitularFields } from "./TitularFields";
import { AddressFields } from "./AddressFields";
import { unidadeUsinaFormSchema, type UnidadeUsinaFormData } from "./schema";

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
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      titular_id: "",
      titular_tipo: "cooperativa",
    },
  });

  // Limpa o titular_id quando o tipo de titular muda
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "titular_tipo") {
        form.setValue("titular_id", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
            form.reset({
              numero_uc: data.numero_uc,
              logradouro: data.logradouro || "",
              numero: data.numero || "",
              complemento: data.complemento || "",
              bairro: data.bairro || "",
              cidade: data.cidade || "",
              uf: data.uf || "",
              cep: data.cep || "",
              titular_id: data.titular_id,
              titular_tipo: data.titular_tipo as "cooperado" | "cooperativa",
            });
          }
        });
    } else {
      form.reset({
        numero_uc: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        titular_id: "",
        titular_tipo: "cooperativa",
      });
    }
  }, [unidadeId, form]);

  const onSubmit = async (data: UnidadeUsinaFormData) => {
    try {
      const submitData = {
        numero_uc: data.numero_uc,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep,
        titular_id: data.titular_id,
        titular_tipo: data.titular_tipo,
        status: 'draft',
        session_id: crypto.randomUUID(),
      };

      let response;
      
      if (unidadeId) {
        response = await supabase
          .from("unidades_usina")
          .update(submitData)
          .eq("id", unidadeId);

        if (response.error) throw response.error;

        const { error: historicoError } = await supabase
          .from("historico_titulares_usina")
          .insert({
            unidade_usina_id: unidadeId,
            titular_id: data.titular_id,
            titular_tipo: data.titular_tipo,
          });

        if (historicoError) throw historicoError;

        toast({
          title: "Unidade atualizada com sucesso!",
        });
      } else {
        response = await supabase
          .from("unidades_usina")
          .insert(submitData)
          .select()
          .single();

        if (response.error) throw response.error;

        const { error: historicoError } = await supabase
          .from("historico_titulares_usina")
          .insert({
            unidade_usina_id: response.data.id,
            titular_id: data.titular_id,
            titular_tipo: data.titular_tipo,
          });

        if (historicoError) throw historicoError;

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

            <TitularFields />
            <AddressFields />

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
