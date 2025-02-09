
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DataVencimentoField } from "./form-fields/DataVencimentoField";
import { ConsumoField } from "./form-fields/ConsumoField";
import { ValoresFields } from "./form-fields/ValoresFields";
import { SaldoEnergiaField } from "./form-fields/SaldoEnergiaField";
import { ObservacaoField } from "./form-fields/ObservacaoField";
import type { FaturaFormProps } from "./types/fatura-form";

interface Props extends FaturaFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export function FaturaForm({ formState, setFormState, isSubmitting, onSubmit, onClose }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <DataVencimentoField
        value={formState.dataVencimento}
        onChange={(value) => setFormState(prev => ({ ...prev, dataVencimento: value }))}
        isSubmitting={isSubmitting}
      />
      
      <ConsumoField
        value={formState.consumo}
        onChange={(value) => setFormState(prev => ({ ...prev, consumo: value }))}
        isSubmitting={isSubmitting}
      />
      
      <ValoresFields
        totalFatura={{
          value: formState.totalFatura,
          onChange: (value) => setFormState(prev => ({ ...prev, totalFatura: value })),
          isSubmitting
        }}
        faturaConcessionaria={{
          value: formState.faturaConcessionaria,
          onChange: (value) => setFormState(prev => ({ ...prev, faturaConcessionaria: value })),
          isSubmitting
        }}
        iluminacaoPublica={{
          value: formState.iluminacaoPublica,
          onChange: (value) => setFormState(prev => ({ ...prev, iluminacaoPublica: value })),
          isSubmitting
        }}
        outrosValores={{
          value: formState.outrosValores,
          onChange: (value) => setFormState(prev => ({ ...prev, outrosValores: value })),
          isSubmitting
        }}
      />
      
      <SaldoEnergiaField
        value={formState.saldoEnergiaKwh}
        onChange={(value) => setFormState(prev => ({ ...prev, saldoEnergiaKwh: value }))}
        isSubmitting={isSubmitting}
      />
      
      <ObservacaoField
        value={formState.observacao}
        onChange={(value) => setFormState(prev => ({ ...prev, observacao: value }))}
        isSubmitting={isSubmitting}
      />
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
