
/**
 * Componente de tabela no estilo Excel para faturas
 * 
 * Este componente oferece uma experiência similar ao Excel para visualização
 * de faturas, com recursos como redimensionamento de colunas, personalização
 * de colunas visíveis e formatação de dados.
 */
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { formatarDocumento } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Column } from "@/components/ui/excel-table/types";
import { ColumnSettings } from "@/components/ui/excel-table/ColumnSettings";
import { NumeroUC } from "./components/NumeroUC";
import { ConsumoKwh } from "./components/ConsumoKwh";
import { DataVencimento } from "./components/DataVencimento";
import { ValorFatura } from "./components/ValoresFatura";

interface FaturasExcelTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
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
  onEdit,
  onUpdateStatus,
  onViewPdf
}: FaturasExcelTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem('faturas-columns-visibility');
    return saved ? JSON.parse(saved) : defaultColumns.map(col => col.id);
  });

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('faturas-column-widths');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('faturas-columns-visibility', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    localStorage.setItem('faturas-column-widths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev =>
      visible
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleResetColumns = () => {
    setVisibleColumns(defaultColumns.map(col => col.id));
    setColumnWidths({});
    localStorage.removeItem('faturas-column-widths');
  };

  const handleColumnResize = (columnId: string, width: number) => {
    console.log(`Coluna ${columnId} redimensionada para ${width}px`);
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const filteredColumns = defaultColumns.filter(col => visibleColumns.includes(col.id));

  return (
    <div className="overflow-hidden">
      <div className="flex justify-end mb-2">
        <ColumnSettings
          columns={defaultColumns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onReset={handleResetColumns}
        />
      </div>
      
      <ExcelTable
        columns={filteredColumns}
        storageKey="faturas-table-config"
        stickyHeader
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onResetColumns={handleResetColumns}
        onColumnResize={handleColumnResize}
      >
        <tbody>
          {faturas.map((fatura) => (
            <tr key={fatura.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
              {filteredColumns.map(column => (
                <td key={column.id} className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
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
                  {column.id === 'uc' && <NumeroUC numeroUC={fatura.unidade_beneficiaria.numero_uc} />}
                  {column.id === 'vencimento' && <DataVencimento dataVencimento={fatura.data_vencimento} />}
                  {column.id === 'consumo' && <ConsumoKwh consumoKwh={fatura.consumo_kwh} />}
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
                    <FaturaActionsMenu
                      fatura={fatura}
                      onViewDetails={onViewDetails}
                      onEdit={onEdit}
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
    </div>
  );
}
