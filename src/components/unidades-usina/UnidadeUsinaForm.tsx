
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TitularFields } from "./TitularFields";
import { AddressFields } from "./AddressFields";
import { UCNumberField } from "./UCNumberField";
import { useUnidadeUsinaForm } from "./hooks/useUnidadeUsinaForm";
import { Loader2 } from "lucide-react";

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
  const { form, onSubmit, isLoading } = useUnidadeUsinaForm({
    unidadeId,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {unidadeId ? "Editar" : "Nova"} Unidade da Usina
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da unidade da usina. Todos os campos marcados com *
            são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UCNumberField />
            <TitularFields />
            <AddressFields />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
