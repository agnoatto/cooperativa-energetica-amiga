
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
import { ValorFatura } from "./components/ValoresFatura";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentConfirmation: (fatura: Fatura) => void;
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentConfirmation
}: FaturaDesktopRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
      {/* Número da UC */}
      <TableCell className="py-3 px-4 text-sm w-[100px]">
        {fatura.unidade_beneficiaria.numero_uc}
      </TableCell>
      
      {/* Informações do Cooperado */}
      <TableCell className="py-3 px-4 text-sm font-medium truncate w-[180px]">
        <ClienteInfo unidadeBeneficiaria={fatura.unidade_beneficiaria} />
      </TableCell>
      
      {/* Consumo em kWh */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        {fatura.consumo_kwh || 0} kWh
      </TableCell>
      
      {/* Valor da Assinatura */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        <ValorFatura valor={fatura.valor_assinatura || 0} />
      </TableCell>
      
      {/* Data de Vencimento */}
      <TableCell className="py-3 px-4 text-sm text-right w-[120px]">
        {formatDateToPtBR(fatura.data_vencimento)}
      </TableCell>
      
      {/* Status da Fatura */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        <FaturaStatusBadge fatura={fatura} />
      </TableCell>
      
      {/* Arquivo da Concessionária */}
      <TableCell className="py-3 px-4 text-sm text-center w-[150px]">
        <ArquivoConcessionaria arquivoPath={fatura.arquivo_concessionaria_path} />
      </TableCell>
      
      {/* Próxima Leitura */}
      <TableCell className="py-3 px-4 text-sm text-center w-[150px]">
        <ProximaLeitura dataProximaLeitura={fatura.data_proxima_leitura} />
      </TableCell>
      
      {/* Menu de Ações */}
      <TableCell className="py-3 px-4 text-sm w-[100px] text-center sticky right-0 bg-white shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]">
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
