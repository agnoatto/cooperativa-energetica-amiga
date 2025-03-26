
/**
 * Linha da tabela de faturas para desktop
 * 
 * Este componente exibe uma linha na tabela de faturas com os dados
 * de uma fatura e as ações disponíveis. Utiliza componentes menores
 * para cada seção lógica da linha, melhorando a manutenibilidade.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { ClienteInfo } from "./components/ClienteInfo";
import { ArquivoConcessionaria } from "./components/ArquivoConcessionaria";
import { ProximaLeitura } from "./components/ProximaLeitura";
import { AcoesRapidas } from "./components/AcoesRapidas";
import { ValorFatura } from "./components/ValoresFatura";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentConfirmation: (fatura: Fatura) => void;
  // A propriedade onViewPdf é opcional agora
  onViewPdf?: (fatura: Fatura) => void;
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentConfirmation,
  // Definimos um valor padrão para onViewPdf usando uma função vazia
  onViewPdf = () => {}
}: FaturaDesktopRowProps) {
  return (
    <TableRow key={fatura.id} className="h-9 hover:bg-gray-50">
      {/* Número da UC */}
      <TableCell className="py-1.5 px-3 text-sm">
        {fatura.unidade_beneficiaria.numero_uc}
      </TableCell>
      
      {/* Informações do Cooperado */}
      <TableCell className="py-1.5 px-3 text-sm font-medium truncate max-w-[180px]">
        <ClienteInfo unidadeBeneficiaria={fatura.unidade_beneficiaria} />
      </TableCell>
      
      {/* Consumo em kWh */}
      <TableCell className="py-1.5 px-3 text-sm text-right">
        {fatura.consumo_kwh || 0} kWh
      </TableCell>
      
      {/* Valor da Assinatura */}
      <TableCell className="py-1.5 px-3 text-sm text-right">
        <ValorFatura valor={fatura.valor_assinatura || 0} />
      </TableCell>
      
      {/* Data de Vencimento */}
      <TableCell className="py-1.5 px-3 text-sm text-right">
        {formatDateToPtBR(fatura.data_vencimento)}
      </TableCell>
      
      {/* Status da Fatura */}
      <TableCell className="py-1.5 px-3 text-sm text-right">
        <FaturaStatusBadge fatura={fatura} />
      </TableCell>
      
      {/* Arquivo da Concessionária */}
      <TableCell className="py-1.5 px-3 text-sm text-center">
        <ArquivoConcessionaria arquivoPath={fatura.arquivo_concessionaria_path} />
      </TableCell>
      
      {/* Próxima Leitura */}
      <TableCell className="py-1.5 px-3 text-sm text-center">
        <ProximaLeitura dataProximaLeitura={fatura.data_proxima_leitura} />
      </TableCell>
      
      {/* Ações Rápidas */}
      <TableCell className="py-1.5 px-3 text-sm">
        <AcoesRapidas fatura={fatura} onUpdateStatus={onUpdateStatus} />
      </TableCell>
      
      {/* Menu de Ações */}
      <TableCell className="py-1.5 px-3 text-sm w-10">
        <FaturaActionsMenu
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onShowPaymentModal={() => onShowPaymentConfirmation(fatura)}
        />
      </TableCell>
    </TableRow>
  );
}
