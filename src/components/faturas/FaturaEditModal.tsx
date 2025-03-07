
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FaturaEditModalProps } from "./types";
import { FaturaEditModalContent } from "./edit-modal/FaturaEditModalContent";
import { useFaturaEditForm } from "./edit-modal/hooks/useFaturaEditForm";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const {
    formState,
    updateField,
    isLoading,
    formErrors,
    handleFileChange,
    handleSubmit
  } = useFaturaEditForm({ fatura, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        
        <FaturaEditModalContent
          faturaId={fatura.id}
          formState={formState}
          updateField={updateField}
          isLoading={isLoading}
          formErrors={formErrors}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={onClose}
          cooperadoInfo={{
            nome: fatura.unidade_beneficiaria.cooperado.nome,
            documento: fatura.unidade_beneficiaria.cooperado.documento,
            numeroUC: fatura.unidade_beneficiaria.numero_uc,
            apelido: fatura.unidade_beneficiaria.apelido,
          }}
          percentualDesconto={fatura.unidade_beneficiaria.percentual_desconto}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
