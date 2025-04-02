
/**
 * Componente de tabela para visualização de unidades em desktop
 * 
 * Este componente exibe os dados de unidades beneficiárias em formato de tabela,
 * otimizado para visualização em desktops, com suporte a ordenação e ações.
 */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Archive, ArchiveRestore } from "lucide-react";
import { formatarKwh } from "@/utils/formatters";
import { SortableTableHeader } from "./SortableTableHeader";
import { StatusBadge } from "./StatusBadge";
import { SortDirection, SortField } from "./useUnidadesSorting";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnidadesDesktopTableProps {
  unidades: any[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onViewDetails: (unidade: any) => void;
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onReativar?: (unidadeId: string) => void;
  setUnidadeToDesativar: (unidade: any) => void;
}

export function UnidadesDesktopTable({
  unidades,
  sortField,
  sortDirection,
  onSort,
  onViewDetails,
  onEdit,
  onReativar,
  setUnidadeToDesativar
}: UnidadesDesktopTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <ScrollArea className="w-full" type="always">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[120px]">
                  <SortableTableHeader 
                    field="numero_uc" 
                    title="Número UC"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[150px]">
                  <SortableTableHeader 
                    field="apelido" 
                    title="Apelido"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[250px]">
                  <SortableTableHeader 
                    field="endereco" 
                    title="Endereço"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[100px]">
                  <SortableTableHeader 
                    field="percentual_desconto" 
                    title="Desconto"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[100px]">
                  <SortableTableHeader 
                    field="consumo_kwh" 
                    title="Consumo"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[120px]">
                  <SortableTableHeader 
                    field="data_entrada" 
                    title="Data Entrada"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="w-[100px]">
                  <SortableTableHeader 
                    field="status" 
                    title="Status"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
                <TableHead className="text-right w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow 
                  key={unidade.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onViewDetails(unidade)}
                >
                  <TableCell>{unidade.numero_uc}</TableCell>
                  <TableCell>{unidade.apelido || '-'}</TableCell>
                  <TableCell>{unidade.endereco}</TableCell>
                  <TableCell>{unidade.percentual_desconto}%</TableCell>
                  <TableCell>{formatarKwh(unidade.consumo_kwh)} kWh</TableCell>
                  <TableCell>
                    {formatDate(unidade.data_entrada)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={unidade.data_saida === null} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {unidade.data_saida === null ? (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(unidade.cooperado_id, unidade.id);
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
                                variant="outline" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUnidadeToDesativar(unidade);
                                }}
                                className="h-8 w-8"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Desativar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReativar && onReativar(unidade.id);
                              }}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            >
                              <ArchiveRestore className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reativar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
