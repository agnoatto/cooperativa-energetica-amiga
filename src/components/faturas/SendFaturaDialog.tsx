
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Send, WhatsappIcon } from "lucide-react";
import { Fatura } from "@/types/fatura";
import { useState } from "react";
import { toast } from "sonner";

interface SendFaturaDialogProps {
  fatura: Fatura;
  isOpen: boolean;
  onClose: () => void;
  onSend: (method: "email" | "whatsapp") => Promise<void>;
}

export function SendFaturaDialog({ 
  fatura, 
  isOpen, 
  onClose,
  onSend 
}: SendFaturaDialogProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (method: "email" | "whatsapp") => {
    try {
      setIsSending(true);
      await onSend(method);
      onClose();
      toast.success(`Fatura será enviada por ${method === 'email' ? 'e-mail' : 'WhatsApp'}`);
    } catch (error) {
      console.error('Erro ao enviar fatura:', error);
      toast.error('Erro ao enviar fatura');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Fatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>Unidade Consumidora: {fatura.unidade_beneficiaria.numero_uc}</p>
            <p>Cooperado: {fatura.unidade_beneficiaria.cooperado.nome}</p>
            <p>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valor_total)}</p>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              onClick={() => handleSend('email')}
              disabled={isSending}
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar por E-mail
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleSend('whatsapp')}
              disabled={isSending}
            >
              <WhatsappIcon className="mr-2 h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
