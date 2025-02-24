
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SendMethod } from "./types/pagamento";

interface SendPagamentoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (method: SendMethod) => Promise<void>;
}

export function SendPagamentoDialog({ isOpen, onClose, onSend }: SendPagamentoDialogProps) {
  const [method, setMethod] = useState<SendMethod>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    try {
      setIsSubmitting(true);
      await onSend(method);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enviar Boletim</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha como deseja enviar o boletim
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <RadioGroup value={method} onValueChange={(value) => setMethod(value as SendMethod)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Enviar por E-mail</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp">Enviar por WhatsApp</Label>
            </div>
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
