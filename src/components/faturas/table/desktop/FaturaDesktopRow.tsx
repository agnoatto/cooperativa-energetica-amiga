
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
import { NumeroUC } from "./components/NumeroUC";
import { ConsumoKwh } from "./components/ConsumoKwh";
import { DataVencimento } from "./components/DataVencimento";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf?: () => Promise<void>; // Propriedade opcional
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf,
}: FaturaDesktopRowProps) {
  const handleRowClick = () => {
    onViewDetails(fatura);
  };

  return (
    <TableRow className="hover:bg-gray-50" onClick={handleRowClick}>
      {/* Número da UC */}
      <TableCell className="py-3 px-4 text-sm w-[100px]">
        <NumeroUC numeroUC={fatura.unidade_beneficiaria.numero_uc} />
      </TableCell>
      
      {/* Informações do Cooperado */}
      <TableCell className="py-3 px-4 text-sm font-medium truncate w-[180px]">
        <ClienteInfo unidadeBeneficiaria={fatura.unidade_beneficiaria} />
      </TableCell>
      
      {/* Consumo em kWh */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        <ConsumoKwh consumoKwh={fatura.consumo_kwh || 0} />
      </TableCell>
      
      {/* Valor da Assinatura */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        <ValorFatura valor={fatura.valor_assinatura || 0} />
      </TableCell>
      
      {/* Data de Vencimento */}
      <TableCell className="py-3 px-4 text-sm text-right w-[120px]">
        <DataVencimento dataVencimento={fatura.data_vencimento} />
      </TableCell>
      
      {/* Status da Fatura */}
      <TableCell className="py-3 px-4 text-sm text-right w-[100px]">
        <FaturaStatusBadge fatura={fatura} />
      </TableCell>
      
      {/* Arquivo da Concessionária */}
      <TableCell className="py-3 px-4 text-sm text-center w-[150px]" onClick={(e) => e.stopPropagation()}>
        <ArquivoConcessionaria arquivoPath={fatura.arquivo_concessionaria_path} onViewPdf={onViewPdf} />
      </TableCell>
      
      {/* Próxima Leitura */}
      <TableCell className="py-3 px-4 text-sm text-center w-[150px]">
        <ProximaLeitura dataProximaLeitura={fatura.data_proxima_leitura} />
      </TableCell>
      
      {/* Menu de Ações */}
      <TableCell className="py-3 px-4 text-sm w-[100px] text-center sticky right-0 bg-white shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]" onClick={(e) => e.stopPropagation()}>
        <FaturaActionsMenu
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      </TableCell>
    </TableRow>
  );
}
