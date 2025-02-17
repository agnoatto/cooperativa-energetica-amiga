
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import { type UsinaFormData } from "./schema";
import { useUsinaForm } from "./hooks/useUsinaForm";
import { UsinaBasicInfoFields } from "./UsinaBasicInfoFields";
import { DadosPagamentoCollapsible } from "./DadosPagamentoCollapsible";

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
  const { form, isLoading, onSubmit, fetchUsinaData, status, setStatus } = useUsinaForm({
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
            <UsinaBasicInfoFields form={form} usinaId={usinaId} />
            <DadosPagamentoCollapsible form={form} />

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatus('ativa')}
                className={`gap-2 ${status === 'ativa' ? 'bg-green-100 hover:bg-green-200' : ''}`}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ativa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatus('inativa')}
                className={`gap-2 ${status === 'inativa' ? 'bg-red-100 hover:bg-red-200' : ''}`}
              >
                <XCircle className="h-4 w-4 text-red-500" />
                Inativa
              </Button>
            </div>

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

