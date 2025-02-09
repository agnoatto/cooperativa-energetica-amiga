
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoStep } from "./forms/BasicInfoStep";
import { FinancialStep } from "./forms/FinancialStep";
import { PaymentDetailsStep } from "./forms/PaymentDetailsStep";
import { UsinaFormData, usinaFormSchema } from "./schema";
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
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  useQuery({
    queryKey: ['usina', usinaId],
    queryFn: async () => {
      if (!usinaId || !open) return null;
      
      const { data, error } = await supabase
        .from("usinas")
        .select("*")
        .eq("id", usinaId)
        .single();

      if (error) throw error;
      if (data) {
        form.reset(data);
      }
      return data;
    },
    enabled: Boolean(usinaId && open),
  });

  const steps = [
    { title: "Informações Básicas", component: BasicInfoStep },
    { title: "Informações Financeiras", component: FinancialStep },
    { title: "Dados de Pagamento", component: PaymentDetailsStep },
  ];

  const CurrentStep = steps[step].component;

  const onSubmit = async (data: UsinaFormData) => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    try {
      setIsLoading(true);
      const usinaData = {
        ...data,
        valor_kwh: Number(data.valor_kwh),
        status: usinaId ? "active" : "draft",
      };

      if (usinaId) {
        const { error } = await supabase
          .from("usinas")
          .update(usinaData)
          .eq("id", usinaId);

        if (error) throw error;
        toast({
          title: "Usina atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("usinas")
          .insert(usinaData);

        if (error) throw error;
        toast({
          title: "Usina cadastrada com sucesso!",
        });
      }

      onSuccess();
      onOpenChange(false);
      setStep(0);
      form.reset();
    } catch (error: any) {
      console.error("Error saving usina:", error);
      toast({
        title: "Erro ao salvar usina",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {usinaId ? "Editar" : "Nova"} Usina - {steps[step].title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CurrentStep form={form} />

            <div className="flex justify-between">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Voltar
                </Button>
              )}
              <Button 
                type="submit"
                className="ml-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : step === steps.length - 1 ? (
                  "Salvar"
                ) : (
                  "Próximo"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
