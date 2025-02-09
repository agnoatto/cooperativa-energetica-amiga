
import React, { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { AddressFields } from "./AddressFields";
import { UnidadeUsinaBasicInfo } from "./UnidadeUsinaBasicInfo";
import { UnidadeUsinaFormValues, ViaCEPResponse } from "./types";

const unidadeUsinaFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  titular_id: z.string().min(1, "Titular é obrigatório"),
  cep: z.string().min(8, "CEP é obrigatório").max(9, "CEP inválido"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.enum([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ], {
    required_error: "UF é obrigatória",
  }),
});

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
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<UnidadeUsinaFormValues>({
    resolver: zodResolver(unidadeUsinaFormSchema),
    defaultValues: {
      numero_uc: "",
      titular_id: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: undefined,
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
              titular_id: data.titular_id,
              logradouro: data.logradouro || "",
              numero: data.numero || "",
              complemento: data.complemento || "",
              bairro: data.bairro || "",
              cidade: data.cidade || "",
              uf: data.uf as any || undefined,
              cep: data.cep || "",
            });
          }
        });
    } else {
      form.reset({
        numero_uc: "",
        titular_id: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: undefined,
      });
    }
  }, [unidadeId, form]);

  const onFetchCep = async (cep: string) => {
    try {
      setIsLoadingCep(true);
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          variant: "destructive",
        });
        return;
      }

      form.setValue('logradouro', data.logradouro);
      form.setValue('bairro', data.bairro);
      form.setValue('cidade', data.localidade);
      form.setValue('uf', data.uf as any);
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const onSubmit = async (data: UnidadeUsinaFormValues) => {
    try {
      const submitData = {
        numero_uc: data.numero_uc,
        titular_id: data.titular_id,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep,
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
            <UnidadeUsinaBasicInfo form={form} investidores={investidores} />
            <AddressFields 
              form={form}
              isLoadingCep={isLoadingCep}
              onFetchCep={onFetchCep}
            />

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
