import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Archive, ArchiveRestore, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnidadeDetailsDialog } from "./UnidadeDetailsDialog";
import { DesativarUnidadeDialog } from "./dialogs/DesativarUnidadeDialog";
import { useState, useMemo } from "react";
import { formatarKwh } from "@/utils/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { unidadesTableColumns, UNIDADES_TABLE_STORAGE_KEY } from "./table/unidadesTableConfig";

// Define tipo para a ordenação
type SortDirection = 'asc' | 'desc' | null;
type SortField = 'numero_uc' | 'apelido' | 'endereco' | 'percentual_desconto' | 'consumo_kwh' | 'data_entrada' | 'status';

interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string, motivo?: string) => Promise<void>;
  onReativar?: (unidadeId: string) => Promise<void>;
  visibleColumns?: string[]; // Adiciona prop para controlar colunas visíveis
}

export function UnidadesTable({
  unidades,
  onEdit,
  onDelete,
  onReativar,
  visibleColumns = unidadesTableColumns.map(col => col.id), // Padrão: todas as colunas
}: UnidadesTableProps) {
  const isMobile = useIsMobile();
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [unidadeToDesativar, setUnidadeToDesativar] = useState<any>(null);
  const [isDesativando, setIsDesativando] = useState(false);
  
  // Estado para ordenação
  const [sortField, setSortField] = useState<SortField>('numero_uc');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleViewDetails = (unidade: any) => {
    setSelectedUnidade(unidade);
    setShowDetailsDialog(true);
  };

  const handleDesativarConfirm = async (unidadeId: string, motivo: string) => {
    setIsDesativando(true);
    try {
      await onDelete(unidadeId, motivo);
    } finally {
      setIsDesativando(false);
      setUnidadeToDesativar(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Se já estiver ordenando por este campo, alterne a direção ou remova a ordenação
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      // Se estiver mudando o campo, inicie com ordenação ascendente
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Função de ordenação para diferentes tipos de dados
  const sortData = (a: any, b: any, field: SortField, direction: SortDirection) => {
    if (direction === null) return 0;

    const multiplier = direction === 'asc' ? 1 : -1;

    // Se for o campo status, comparamos pelo atributo data_saida
    if (field === 'status') {
      const aIsActive = a.data_saida === null;
      const bIsActive = b.data_saida === null;
      return aIsActive === bIsActive ? 0 : aIsActive ? -multiplier : multiplier;
    }

    // Campos numéricos
    if (field === 'percentual_desconto' || field === 'consumo_kwh') {
      return (a[field] - b[field]) * multiplier;
    }

    // Campos de data
    if (field === 'data_entrada') {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return (dateA.getTime() - dateB.getTime()) * multiplier;
    }

    // Campos de texto, por padrão
    const valA = a[field]?.toString().toLowerCase() || '';
    const valB = b[field]?.toString().toLowerCase() || '';
    return valA.localeCompare(valB) * multiplier;
  };

  // Unidades ordenadas usando useMemo para evitar recálculos desnecessários
  const sortedUnidades = useMemo(() => {
    if (!sortDirection) return unidades;
    
    return [...unidades].sort((a, b) => sortData(a, b, sortField, sortDirection));
  }, [unidades, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (unidade: any) => {
    if (unidade.data_saida) {
      return <Badge variant="outline" className="bg-gray-100">Desativada</Badge>;
    }
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativa</Badge>;
  };

  // Componente para o indicador de ordenação
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 ml-1" />;
    }
    
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 ml-1" />;
    }
    
    return null;
  };

  // Estilo para cabeçalhos ordenáveis
  const getSortableHeaderStyle = (field: SortField) => {
    return `flex items-center ${sortField === field ? 'text-primary' : ''} cursor-pointer hover:text-primary transition-colors`;
  };

  // Filtrar colunas com base nas colunas visíveis
  const filteredColumns = unidadesTableColumns.filter(col => 
    visibleColumns.includes(col.id)
  );

  if (isMobile) {
    // Na versão mobile, sempre mantemos as informações essenciais
    return (
      <>
        <div className="space-y-4">
          {sortedUnidades.map((unidade) => (
            <div 
              key={unidade.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              onClick={() => handleViewDetails(unidade)}
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">UC: {unidade.numero_uc}</h3>
                  {unidade.apelido && (
                    <p className="text-sm text-gray-500 mt-1">
                      Apelido: {unidade.apelido}
                    </p>
                  )}
                </div>
                <div>{getStatusBadge(unidade)}</div>
              </div>

              <div className="space-y-2 text-sm">
                {/* Mostrar cooperado se estiver nas colunas visíveis */}
                {visibleColumns.includes('cooperado') && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Cooperado:</span>
                    <span>{unidade.cooperado?.nome}</span>
                  </div>
                )}

                {visibleColumns.includes('percentual_desconto') && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Desconto:</span>
                    <span>{unidade.percentual_desconto}%</span>
                  </div>
                )}

                {visibleColumns.includes('consumo_kwh') && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Consumo:</span>
                    <span>{formatarKwh(unidade.consumo_kwh)} kWh</span>
                  </div>
                )}

                {visibleColumns.includes('data_entrada') && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Data Entrada:</span>
                    <span>{formatDate(unidade.data_entrada)}</span>
                  </div>
                )}

                {unidade.data_saida && visibleColumns.includes('data_saida') && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Data Saída:</span>
                    <span>{formatDate(unidade.data_saida)}</span>
                  </div>
                )}

                {visibleColumns.includes('endereco') && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 text-sm line-clamp-2">{unidade.endereco}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {!unidade.data_saida ? (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(unidade.cooperado_id, unidade.id);
                            }}
                            className="h-10 w-10 p-0"
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
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUnidadeToDesativar(unidade);
                            }}
                            className="h-10 w-10 p-0"
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
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReativar && onReativar(unidade.id);
                          }}
                          className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
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
              </div>
            </div>
          ))}
        </div>

        <UnidadeDetailsDialog
          unidade={selectedUnidade}
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedUnidade(null);
          }}
        />

        <DesativarUnidadeDialog
          unidade={unidadeToDesativar}
          isOpen={!!unidadeToDesativar}
          isProcessing={isDesativando}
          onConfirm={handleDesativarConfirm}
          onCancel={() => setUnidadeToDesativar(null)}
        />
      </>
    );
  }

  // Versão desktop - adaptada para usar o ExcelTable para algumas visualizações
  return (
    <>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <ExcelTable
          columns={filteredColumns}
          storageKey={UNIDADES_TABLE_STORAGE_KEY}
        >
          <tbody>
            {sortedUnidades.map((unidade) => (
              <tr
                key={unidade.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewDetails(unidade)}
              >
                {visibleColumns.includes('numero_uc') && (
                  <td className="truncate">{unidade.numero_uc}</td>
                )}
                
                {visibleColumns.includes('cooperado') && (
                  <td className="truncate">{unidade.cooperado?.nome || '-'}</td>
                )}
                
                {visibleColumns.includes('apelido') && (
                  <td className="truncate">{unidade.apelido || '-'}</td>
                )}
                
                {visibleColumns.includes('endereco') && (
                  <td className="truncate max-w-[300px]">{unidade.endereco}</td>
                )}
                
                {visibleColumns.includes('percentual_desconto') && (
                  <td className="truncate">{unidade.percentual_desconto}%</td>
                )}
                
                {visibleColumns.includes('consumo_kwh') && (
                  <td className="truncate">{formatarKwh(unidade.consumo_kwh)} kWh</td>
                )}
                
                {visibleColumns.includes('data_entrada') && (
                  <td className="truncate">{formatDate(unidade.data_entrada)}</td>
                )}
                
                {visibleColumns.includes('data_saida') && (
                  <td className="truncate">
                    {unidade.data_saida ? formatDate(unidade.data_saida) : '-'}
                  </td>
                )}
                
                {visibleColumns.includes('status') && (
                  <td>{getStatusBadge(unidade)}</td>
                )}
                
                {visibleColumns.includes('acoes') && (
                  <td className="text-right whitespace-nowrap">
                    {!unidade.data_saida ? (
                      <div className="flex justify-end space-x-2">
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
                      </div>
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
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </ExcelTable>
      </div>

      <UnidadeDetailsDialog
        unidade={selectedUnidade}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedUnidade(null);
        }}
      />

      <DesativarUnidadeDialog
        unidade={unidadeToDesativar}
        isOpen={!!unidadeToDesativar}
        isProcessing={isDesativando}
        onConfirm={handleDesativarConfirm}
        onCancel={() => setUnidadeToDesativar(null)}
      />
    </>
  );
}
