
/**
 * Componente para o cabeçalho do modal de edição de faturas
 * 
 * Exibe o título, a descrição e informações principais da fatura sendo editada,
 * como número UC, nome do cliente e mês de referência.
 */
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarDocumento } from "@/utils/formatters";

interface ModalHeaderProps {
  fatura: {
    unidade_beneficiaria: {
      numero_uc: string;
      apelido: string | null;
      cooperado: {
        nome: string;
        documento: string;
      };
    };
    mes?: number;
    ano?: number;
  };
}

export function ModalHeader({ fatura }: ModalHeaderProps) {
  // Formatar mês/ano para exibição quando disponíveis
  const mesAnoFormatado = fatura.mes && fatura.ano ? 
    format(new Date(fatura.ano, fatura.mes - 1), "MMMM 'de' yyyy", { locale: ptBR }) : 
    "";

  return (
    <DialogHeader>
      <DialogTitle>Editar Fatura</DialogTitle>
      <DialogDescription className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">
          UC: {fatura.unidade_beneficiaria.numero_uc} 
          {fatura.unidade_beneficiaria.apelido && ` - ${fatura.unidade_beneficiaria.apelido}`}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Cliente: {fatura.unidade_beneficiaria.cooperado.nome} 
          {fatura.unidade_beneficiaria.cooperado.documento && 
            ` - ${formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}`}
        </div>
        {mesAnoFormatado && (
          <div className="text-sm font-medium text-muted-foreground">
            Referência: {mesAnoFormatado}
          </div>
        )}
      </DialogDescription>
    </DialogHeader>
  );
}
