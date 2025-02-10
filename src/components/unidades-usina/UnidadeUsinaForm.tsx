
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TitularFields } from "./TitularFields";
import { AddressFields } from "./AddressFields";
import { UCNumberField } from "./UCNumberField";
import { useUnidadeUsinaForm } from "./hooks/useUnidadeUsinaForm";

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
  const { form, onSubmit } = useUnidadeUsinaForm({
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
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UCNumberField />
            <TitularFields />
            <AddressFields />
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
