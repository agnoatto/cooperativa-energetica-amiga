
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { DadosPagamentoFields } from "./DadosPagamentoFields";
import { type UsinaFormData } from "./schema";
import { useUsinaForm } from "./hooks/useUsinaForm";
import { UsinaBasicInfoFields } from "./UsinaBasicInfoFields";

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
  const { form, isLoading, onSubmit, fetchUsinaData } = useUsinaForm({
    usinaId,
    onSuccess,
    onOpenChange,
  });

  useEffect(() => {
    fetchUsinaData(open);
  }, [usinaId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{usinaId ? "Editar" : "Nova"} Usina</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <UsinaBasicInfoFields form={form} />
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
