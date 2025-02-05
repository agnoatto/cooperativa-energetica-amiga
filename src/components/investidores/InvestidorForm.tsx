import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { InvestidorFormFields } from "./InvestidorFormFields";
import { investidorFormSchema, type InvestidorFormData } from "./types";

interface InvestidorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investidorId?: string;
  onSuccess: () => void;
}

export function InvestidorForm({
  open,
  onOpenChange,
  investidorId,
  onSuccess,
}: InvestidorFormProps) {
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

  React.useEffect(() => {
    if (investidorId) {
      supabase
        .from("investidores")
        .select("*")
        .eq("id", investidorId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching investidor:", error);
            return;
          }
          if (data) {
            form.reset({
              nome_investidor: data.nome_investidor,
              documento: data.documento,
              telefone: data.telefone || "",
              email: data.email || "",
            });
          }
        });
    } else {
      form.reset({
        nome_investidor: "",
        documento: "",
        telefone: "",
        email: "",
      });
    }
  }, [investidorId, form]);

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      const submitData = {
        nome_investidor: data.nome_investidor,
        documento: data.documento.replace(/\D/g, ""),
        telefone: data.telefone ? data.telefone.replace(/\D/g, "") : null,
        email: data.email || null,
        updated_at: new Date().toISOString(),
      };

      if (investidorId) {
        const { error } = await supabase
          .from("investidores")
          .update(submitData)
          .eq("id", investidorId);
        if (error) throw error;
        toast({
          title: "Investidor atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase.from("investidores").insert({
          ...submitData,
          status: "draft",
          session_id: crypto.randomUUID(),
        });
        if (error) throw error;
        toast({
          title: "Investidor criado com sucesso!",
        });
      }
      onSuccess();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {investidorId ? "Editar" : "Novo"} Investidor
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InvestidorFormFields form={form} />
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}