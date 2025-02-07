import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CurrencyInput } from "./CurrencyInput";
import { FileUpload, Upload } from "lucide-react";

interface FaturaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: {
    id: string;
    consumo_kwh: number;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    arquivo_concessionaria_path?: string | null;
    arquivo_concessionaria_nome?: string | null;
    unidade_beneficiaria: {
      percentual_desconto: number;
    };
  };
  onSuccess: () => void;
}

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh.toString());
  const [totalFatura, setTotalFatura] = useState(fatura.total_fatura.toFixed(2).replace('.', ','));
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(fatura.fatura_concessionaria.toFixed(2).replace('.', ','));
  const [iluminacaoPublica, setIluminacaoPublica] = useState(fatura.iluminacao_publica.toFixed(2).replace('.', ','));
  const [outrosValores, setOutrosValores] = useState(fatura.outros_valores.toFixed(2).replace('.', ','));
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const parseValue = (value: string): number => {
    return Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const calculateValues = () => {
    const total = parseValue(totalFatura);
    const iluminacao = parseValue(iluminacaoPublica);
    const outros = parseValue(outrosValores);
    const concessionaria = parseValue(faturaConcessionaria);
    const percentualDesconto = fatura.unidade_beneficiaria.percentual_desconto / 100;

    const baseDesconto = total - iluminacao - outros;
    const valorDesconto = baseDesconto * percentualDesconto;
    const valorAposDesconto = baseDesconto - valorDesconto;
    const valorFinal = valorAposDesconto - concessionaria;

    return {
      valor_desconto: valorDesconto,
      valor_total: valorFinal
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('faturaId', fatura.id);

    try {
      const { error } = await supabase.functions.invoke('upload-fatura', {
        body: formData,
      });

      if (error) throw error;

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const calculatedValues = calculateValues();

    try {
      const { error } = await supabase
        .from("faturas")
        .update({
          consumo_kwh: Number(consumo),
          total_fatura: parseValue(totalFatura),
          fatura_concessionaria: parseValue(faturaConcessionaria),
          iluminacao_publica: parseValue(iluminacaoPublica),
          outros_valores: parseValue(outrosValores),
          valor_desconto: calculatedValues.valor_desconto,
          valor_total: calculatedValues.valor_total,
        })
        .eq("id", fatura.id);

      if (error) throw error;

      toast.success("Fatura atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar fatura:", error);
      toast.error("Erro ao atualizar fatura");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!fatura.arquivo_concessionaria_path) return;

    try {
      const { data, error } = await supabase.storage
        .from('faturas_concessionaria')
        .download(fatura.arquivo_concessionaria_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fatura.arquivo_concessionaria_nome || 'fatura.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label>Arquivo da Fatura</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {fatura.arquivo_concessionaria_path && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={downloadFile}
                  title="Baixar arquivo"
                >
                  <FileUpload className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isUploading && <p className="text-sm text-muted-foreground">Enviando arquivo...</p>}
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="consumo">Consumo (kWh)</Label>
            <Input
              type="number"
              id="consumo"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="totalFatura">Valor Total Original</Label>
            <CurrencyInput
              id="totalFatura"
              value={totalFatura}
              onChange={setTotalFatura}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
            <CurrencyInput
              id="faturaConcessionaria"
              value={faturaConcessionaria}
              onChange={setFaturaConcessionaria}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <CurrencyInput
              id="iluminacaoPublica"
              value={iluminacaoPublica}
              onChange={setIluminacaoPublica}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <CurrencyInput
              id="outrosValores"
              value={outrosValores}
              onChange={setOutrosValores}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
