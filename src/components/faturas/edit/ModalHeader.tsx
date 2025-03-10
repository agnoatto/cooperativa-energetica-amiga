
/**
 * Componente para o cabeçalho do modal de edição de faturas
 * 
 * Exibe o título e a descrição do modal de edição de faturas.
 */
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function ModalHeader() {
  return (
    <DialogHeader>
      <DialogTitle>Editar Fatura</DialogTitle>
      <DialogDescription>
        Preencha os campos abaixo para atualizar os dados da fatura.
      </DialogDescription>
    </DialogHeader>
  );
}
