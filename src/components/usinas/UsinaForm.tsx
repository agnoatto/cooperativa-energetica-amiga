import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ValorKwhField } from "./form/ValorKwhField";
import { DadosPagamentoFields } from "./form/DadosPagamentoFields";
import { usinaFormSchema, type UsinaFormData } from "./schema";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UsinaFormData>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues: {
      investidor_id: "",
      unidade_usina_id: "",
      valor_kwh: 0,
      dados_pagamento_nome: "",
      dados_pagamento_documento: "",
      dados_pagamento_banco: "",
      dados_pagamento_agencia: "",
      dados_pagamento_conta: "",
      dados_pagamento_telefone: "",
      dados_pagamento_email: "",
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select(`
          id,
          numero_uc,
          logradouro,
          numero,
          complemento,
          cidade,
          uf,
          cep
        `)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (usinaId && open) {
      setIsLoading(true);
      Promise.resolve(
        supabase
          .from("usinas")
          .select("*")
          .eq("id", usinaId)
          .single()
      ).then(({ data, error }) => {
        if (error) {
          console.error("Error fetching usina:", error);
          return;
        }
        if (data) {
          form.reset(data);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    } else if (!open) {
      form.reset();
    }
  }, [usinaId, open, form]);

  const onSubmit = async (data: UsinaFormData) => {
    try {
      setIsLoading(true);
      const usinaData = {
        investidor_id: data.investidor_id,
        unidade_usina_id: data.unidade_usina_id,
        valor_kwh: data.valor_kwh,
        dados_pagamento_nome: data.dados_pagamento_nome,
        dados_pagamento_documento: data.dados_pagamento_documento,
        dados_pagamento_banco: data.dados_pagamento_banco,
        dados_pagamento_agencia: data.dados_pagamento_agencia,
        dados_pagamento_conta: data.dados_pagamento_conta,
        dados_pagamento_telefone: data.dados_pagamento_telefone,
        dados_pagamento_email: data.dados_pagamento_email,
        status: usinaId ? 'active' : 'draft',
      };

      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update(usinaData)
          .eq("id", usinaId);

        if (error) throw error;
        toast.success("Usina atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("usinas")
          .insert(usinaData);

        if (error) throw error;
        toast.success("Usina cadastrada com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving usina:", error);
      toast.error(
        `Erro ao ${usinaId ? "atualizar" : "cadastrar"} usina: ` + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{usinaId ? "Editar" : "Nova"} Usina</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields 
              form={form} 
              investidores={investidores || []} 
              unidades={unidades || []} 
            />
            
            <ValorKwhField form={form} />

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados de Pagamento</h3>
              <DadosPagamentoFields form={form} />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}