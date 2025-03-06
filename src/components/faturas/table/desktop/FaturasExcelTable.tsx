
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { FaturaRowActions } from "../FaturaRowActions";
import { formatarDocumento } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Column } from "@/components/ui/excel-table/types";

interface FaturasExcelTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

const defaultColumns: Column[] = [
  {
    id: 'cooperado',
    label: 'Cooperado',
    width: 300,
    minWidth: 200
  },
  {
    id: 'documento',
    label: 'CNPJ/CPF',
    width: 180,
    minWidth: 150
  },
  {
    id: 'uc',
    label: 'Instalação',
    width: 150,
    minWidth: 120
  },
  {
    id: 'vencimento',
    label: 'Data Vencimento',
    width: 150,
    minWidth: 120
  },
  {
    id: 'consumo',
    label: 'Consumo (kWh)',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_original',
    label: 'Valor Original',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_assinatura',
    label: 'Valor da Assinatura',
    width: 150,
    minWidth: 120
  },
  {
    id: 'status',
    label: 'Status',
    width: 130,
    minWidth: 100
  },
  {
    id: 'acoes',
    label: 'Ações',
    width: 120,
    minWidth: 100
  }
];

export function FaturasExcelTable({
  faturas,
  onViewDetails,
  onDelete,
  onUpdateStatus
}: FaturasExcelTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem('faturas-columns-visibility');
    return saved ? JSON.parse(saved) : defaultColumns.map(col => col.id);
  });

  useEffect(() => {
    localStorage.setItem('faturas-columns-visibility', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev =>
      visible
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleResetColumns = () => {
    setVisibleColumns(defaultColumns.map(col => col.id));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const filteredColumns = defaultColumns.filter(col => visibleColumns.includes(col.id));

  return (
    <ExcelTable
      columns={filteredColumns}
      storageKey="faturas-table-config"
      stickyHeader
      visibleColumns={visibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      onResetColumns={handleResetColumns}
    >
      <tbody>
        {faturas.map((fatura) => (
          <tr key={fatura.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
            {filteredColumns.map(column => (
              <td key={column.id} className="px-2 py-1 whitespace-nowrap">
                {column.id === 'cooperado' && (
                  <span className="text-gray-900">
                    {fatura.unidade_beneficiaria.cooperado.nome}
                    {fatura.unidade_beneficiaria.apelido && (
                      <span className="text-gray-400 ml-1">
                        ({fatura.unidade_beneficiaria.apelido})
                      </span>
                    )}
                  </span>
                )}
                {column.id === 'documento' && formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
                {column.id === 'uc' && fatura.unidade_beneficiaria.numero_uc}
                {column.id === 'vencimento' && formatDateToPtBR(fatura.data_vencimento)}
                {column.id === 'consumo' && `${fatura.consumo_kwh} kWh`}
                {column.id === 'valor_original' && formatCurrency(fatura.total_fatura)}
                {column.id === 'valor_assinatura' && (
                  <>
                    {formatCurrency(fatura.valor_assinatura)}
                    {fatura.valor_adicional > 0 && (
                      <span className="text-yellow-600 text-xs ml-1">
                        +{formatCurrency(fatura.valor_adicional)}
                      </span>
                    )}
                  </>
                )}
                {column.id === 'status' && <FaturaStatusBadge fatura={fatura} />}
                {column.id === 'acoes' && (
                  <FaturaRowActions
                    fatura={fatura}
                    onViewDetails={onViewDetails}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
