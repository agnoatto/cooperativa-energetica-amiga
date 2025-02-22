
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { format } from "date-fns";
import { ActionMenu } from "./ActionMenu";
import { unidadesTableColumns } from "./tableConfig";
import { UnidadesTableProps } from "./types";

export function DesktopTable({ 
  unidades, 
  onEdit, 
  onDelete 
}: UnidadesTableProps) {
  return (
    <ExcelTable 
      columns={unidadesTableColumns} 
      storageKey="unidades-beneficiarias-table-settings"
    >
      <tbody>
        {unidades.map((unidade) => (
          <tr key={unidade.id}>
            <td>{unidade.numero_uc}</td>
            <td>{unidade.apelido || '-'}</td>
            <td className="whitespace-nowrap">{unidade.endereco}</td>
            <td className="whitespace-nowrap">{unidade.percentual_desconto}%</td>
            <td className="whitespace-nowrap">
              {format(new Date(unidade.data_entrada), 'dd/MM/yyyy')}
            </td>
            <td className="text-right whitespace-nowrap space-x-2">
              <ActionMenu 
                unidade={unidade}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
