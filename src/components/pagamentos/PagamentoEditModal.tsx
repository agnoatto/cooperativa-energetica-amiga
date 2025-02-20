
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";
import { FileUploadSection } from "./form/FileUploadSection";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({
  pagamento,
  isOpen,
  onClose,
  onSave,
}: PagamentoEditModalProps) {
  const {
    form,
    setForm,
    valorKwh,
    valorBruto,
    valorTotalTusdFioB,
    valorEfetivo,
    handleSubmit,
  } = usePagamentoForm(pagamento, onSave, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="dados">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados">Dados do Pagamento</TabsTrigger>
              <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-6">
              <PagamentoFormFields
                form={form}
                setForm={setForm}
                valorKwh={valorKwh}
                valorBruto={valorBruto}
                valorTotalTusdFioB={valorTotalTusdFioB}
                valorEfetivo={valorEfetivo}
              />
            </TabsContent>

            <TabsContent value="arquivos" className="space-y-6">
              {pagamento && (
                <FileUploadSection
                  form={form}
                  setForm={setForm}
                  pagamentoId={pagamento.id}
                />
              )}
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
