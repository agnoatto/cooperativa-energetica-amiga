
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PagamentoFormValues } from "./types/pagamento";
import { FileUploadSection } from "./form/FileUploadSection";
import { GeracaoSection } from "./form/GeracaoSection";
import { ValoresSection } from "./form/ValoresSection";
import { DatasSection } from "./form/DatasSection";
import { StatusSection } from "./form/StatusSection";

interface PagamentoFormFieldsProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  valorKwh: number;
  valorBruto: number;
  valorEfetivo: number;
  valorTotalTusdFioB: number;
  pagamentoId: string;
}

export function PagamentoFormFields({
  form,
  setForm,
  valorKwh,
  valorBruto,
  valorEfetivo,
  valorTotalTusdFioB,
  pagamentoId
}: PagamentoFormFieldsProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <FileUploadSection 
          form={form} 
          setForm={setForm} 
          pagamentoId={pagamentoId} 
        />
        
        <GeracaoSection 
          form={form} 
          setForm={setForm} 
          valorKwh={valorKwh} 
        />
        
        <ValoresSection 
          form={form} 
          setForm={setForm} 
          valorBruto={valorBruto}
          valorEfetivo={valorEfetivo}
          valorTotalTusdFioB={valorTotalTusdFioB}
        />
        
        <DatasSection 
          form={form} 
          setForm={setForm} 
        />
        
        <StatusSection 
          form={form} 
          setForm={setForm} 
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit" variant="default">
            Salvar
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
