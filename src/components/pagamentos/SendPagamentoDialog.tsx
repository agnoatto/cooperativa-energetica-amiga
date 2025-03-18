
/**
 * Diálogo para envio de boletim de pagamento
 * 
 * Este componente permite selecionar o método de envio (email ou WhatsApp)
 * e controla o processo de envio com feedbacks visuais de carregamento e erro.
 */
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
import { Loader2 } from "lucide-react";

interface SendPagamentoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (method: SendMethod) => Promise<void>;
}

export function SendPagamentoDialog({ isOpen, onClose, onSend }: SendPagamentoDialogProps) {
  const [method, setMethod] = useState<SendMethod>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSend(method);
      onClose();
    } catch (error: any) {
      console.error('Erro ao enviar:', error);
      setError(error.message || 'Ocorreu um erro ao enviar o boletim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
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
          
          {error && (
            <div className="mt-4 text-sm px-3 py-2 rounded bg-red-50 text-red-600 border border-red-200">
              {error}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : "Enviar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
