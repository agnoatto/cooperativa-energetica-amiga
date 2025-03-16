
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash, Eye } from "lucide-react";
import { cooperadosTableColumns } from "./tableConfig";
import { CooperadoTableProps } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DesktopTable({ 
  cooperados, 
  unidades, 
  onEdit, 
  onDelete, 
  onAddUnidade, 
  onViewDetails 
}: CooperadoTableProps) {
  return (
    <ExcelTable 
      columns={cooperadosTableColumns} 
      storageKey="cooperados-table-settings"
    >
      <tbody>
        {cooperados.map((cooperado) => (
          <tr
            key={cooperado.id}
            className="cursor-pointer"
          >
            <td>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {cooperado.nome}
                </span>
                <span className="text-sm text-gray-500">
                  {formatarDocumento(cooperado.documento)}
                </span>
              </div>
            </td>
            <td>{cooperado.numero_cadastro || '-'}</td>
            <td>
              {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </td>
            <td>
              <div className="leading-tight">
                {formatarTelefone(cooperado.telefone)}
                <br />
                {cooperado.email || '-'}
              </div>
            </td>
            <td>
              <div className="flex items-center space-x-2">
                <span>
                  {unidades.filter(u => u.cooperado_id === cooperado.id).length}
                </span>
              </div>
            </td>
            <td className="text-right">
              <div className="flex justify-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(cooperado.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visualizar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(cooperado.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddUnidade(cooperado.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar Unidade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(cooperado.id);
                        }}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
