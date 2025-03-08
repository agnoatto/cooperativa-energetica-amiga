
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DesativarUnidadeDialogProps {
  unidade: any;
  isOpen: boolean;
  isProcessing: boolean;
  onConfirm: (unidadeId: string, motivo: string) => Promise<void>;
  onCancel: () => void;
}

export function DesativarUnidadeDialog({
  unidade,
  isOpen,
  isProcessing,
  onConfirm,
  onCancel,
}: DesativarUnidadeDialogProps) {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = async () => {
    if (!unidade) return;
    await onConfirm(unidade.id, motivo);
  };

  if (!unidade) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desativar Unidade Beneficiária</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a desativar a unidade beneficiária UC {unidade.numero_uc}.
            Esta ação irá arquivar a unidade. Você poderá reativá-la posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="motivo" className="mb-2 block">
            Motivo da desativação (opcional)
          </Label>
          <Textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Informe o motivo da desativação..."
            className="h-24"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isProcessing ? "Processando..." : "Desativar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
