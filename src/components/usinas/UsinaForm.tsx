
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUsinaForm } from "./hooks/useUsinaForm";
import { UsinaBasicInfoFields } from "./UsinaBasicInfoFields";
import { DadosPagamentoCollapsible } from "./DadosPagamentoCollapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchUsinaData(open);
  }, [usinaId, open]);

  const handleStatusChange = (checked: boolean) => {
    const dataInicio = form.getValues("data_inicio");
    if (checked && !dataInicio) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setStatus(checked ? 'active' : 'draft');
  };

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

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={status === 'active'}
                  onCheckedChange={handleStatusChange}
                />
                <Label htmlFor="status" className="text-sm">
                  {status === 'active' ? 'Ativa' : 'Inativa'}
                </Label>
              </div>

              {showAlert && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Para ativar a usina, é necessário definir uma Data de Início.
                  </AlertDescription>
                </Alert>
              )}
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
