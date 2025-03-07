
import { useState, useEffect } from "react";
import { Fatura } from "@/types/fatura";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "./CurrencyInput";
import { Textarea } from "@/components/ui/textarea";
import { format, parse } from "date-fns";
import { UpdateFaturaInput } from "@/hooks/faturas/useUpdateFatura";

interface EditFaturaModalProps {
  fatura: Fatura | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateFaturaInput) => Promise<void>;
  isProcessing: boolean;
}

export function EditFaturaModal({
  fatura,
  isOpen,
  onClose,
  onSave,
  isProcessing
}: EditFaturaModalProps) {
  const [formData, setFormData] = useState<Partial<Fatura>>({});

  useEffect(() => {
    if (fatura) {
      setFormData({
        id: fatura.id,
        consumo_kwh: fatura.consumo_kwh,
        valor_assinatura: fatura.valor_assinatura,
        data_vencimento: fatura.data_vencimento,
        fatura_concessionaria: fatura.fatura_concessionaria,
        total_fatura: fatura.total_fatura,
        iluminacao_publica: fatura.iluminacao_publica,
        outros_valores: fatura.outros_valores,
        valor_desconto: fatura.valor_desconto,
        economia_acumulada: fatura.economia_acumulada,
        saldo_energia_kwh: fatura.saldo_energia_kwh,
        observacao: fatura.observacao
      });
    }
  }, [fatura]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    const numericValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fatura) return;

    try {
      await onSave({
        id: fatura.id,
        ...formData
      });
    } catch (error) {
      console.error("Erro ao salvar fatura:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      return "";
    }
  };

  if (!fatura) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consumo_kwh">Consumo (kWh)</Label>
              <Input
                id="consumo_kwh"
                name="consumo_kwh"
                type="number"
                value={formData.consumo_kwh || 0}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="valor_assinatura">Valor Assinatura</Label>
              <CurrencyInput
                id="valor_assinatura"
                name="valor_assinatura"
                value={String(formData.valor_assinatura || 0)}
                onChange={(value) => handleNumberChange("valor_assinatura", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input
                id="data_vencimento"
                name="data_vencimento"
                type="date"
                value={formatDate(formData.data_vencimento || "")}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <Label htmlFor="fatura_concessionaria">Fatura Concessionária</Label>
              <CurrencyInput
                id="fatura_concessionaria"
                name="fatura_concessionaria"
                value={String(formData.fatura_concessionaria || 0)}
                onChange={(value) => handleNumberChange("fatura_concessionaria", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="total_fatura">Total Fatura</Label>
              <CurrencyInput
                id="total_fatura"
                name="total_fatura"
                value={String(formData.total_fatura || 0)}
                onChange={(value) => handleNumberChange("total_fatura", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="iluminacao_publica">Iluminação Pública</Label>
              <CurrencyInput
                id="iluminacao_publica"
                name="iluminacao_publica"
                value={String(formData.iluminacao_publica || 0)}
                onChange={(value) => handleNumberChange("iluminacao_publica", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="outros_valores">Outros Valores</Label>
              <CurrencyInput
                id="outros_valores"
                name="outros_valores"
                value={String(formData.outros_valores || 0)}
                onChange={(value) => handleNumberChange("outros_valores", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="valor_desconto">Valor Desconto</Label>
              <CurrencyInput
                id="valor_desconto"
                name="valor_desconto"
                value={String(formData.valor_desconto || 0)}
                onChange={(value) => handleNumberChange("valor_desconto", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="economia_acumulada">Economia Acumulada</Label>
              <CurrencyInput
                id="economia_acumulada"
                name="economia_acumulada"
                value={String(formData.economia_acumulada || 0)}
                onChange={(value) => handleNumberChange("economia_acumulada", value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="saldo_energia_kwh">Saldo Energia (kWh)</Label>
              <Input
                id="saldo_energia_kwh"
                name="saldo_energia_kwh"
                type="number"
                value={formData.saldo_energia_kwh || 0}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              name="observacao"
              value={formData.observacao || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
