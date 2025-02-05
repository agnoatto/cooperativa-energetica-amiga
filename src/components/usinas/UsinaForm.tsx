import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InvestidorSelect } from "./InvestidorSelect";
import { UnidadeUsinaSelect } from "./UnidadeUsinaSelect";
import { DadosPagamentoFields } from "./DadosPagamentoFields";
import { usinaFormSchema, type UsinaFormData } from "./schema";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    async function fetchUsinaData() {
      if (usinaId && open) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("usinas")
            .select("*")
            .eq("id", usinaId)
            .single();

          if (error) {
            console.error("Error fetching usina:", error);
            return;
          }
          if (data) {
            form.reset(data);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!open) {
        form.reset();
      }
    }

    fetchUsinaData();
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
        status: usinaId ? "active" : "draft",
      };

      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update(usinaData)
          .eq("id", usinaId);

        if (error) throw error;
        toast.success("Usina atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("usinas").insert(usinaData);

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
            <div className="grid grid-cols-2 gap-4">
              <InvestidorSelect form={form} />
              <UnidadeUsinaSelect form={form} />

              <FormField
                control={form.control}
                name="valor_kwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do kWh</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DadosPagamentoFields form={form} />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}