
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "./CurrencyInput";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FaturaCobrancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaId: string;
  onSuccess: () => void;
}

export function FaturaCobrancaModal({
  isOpen,
  onClose,
  faturaId,
  onSuccess
}: FaturaCobrancaModalProps) {
  const [valor, setValor] = useState("0");
  const [observacao, setObservacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('faturas')
        .update({
          valor_adicional: Number(valor),
          observacao: observacao || null
        })
        .eq('id', faturaId);

      if (error) throw error;

      toast.success('Cobrança atualizada com sucesso');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error);
      toast.error('Erro ao atualizar cobrança');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Cobrança</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="valor">Valor Adicional</Label>
            <CurrencyInput
              id="valor"
              value={valor}
              onChange={setValor}
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="observacao">Observação</Label>
            <Input
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observação sobre a cobrança"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
