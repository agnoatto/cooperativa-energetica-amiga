
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
import { Edit, Eye, Archive, ArchiveRestore } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnidadeDetailsDialog } from "./UnidadeDetailsDialog";
import { DesativarUnidadeDialog } from "./dialogs/DesativarUnidadeDialog";
import { useState } from "react";
import { formatarKwh } from "@/utils/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string, motivo?: string) => Promise<void>;
  onReativar?: (unidadeId: string) => Promise<void>;
}

export function UnidadesTable({
  unidades,
  onEdit,
  onDelete,
  onReativar,
}: UnidadesTableProps) {
  const isMobile = useIsMobile();
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [unidadeToDesativar, setUnidadeToDesativar] = useState<any>(null);
  const [isDesativando, setIsDesativando] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (unidade: any) => {
    if (unidade.data_saida) {
      return <Badge variant="outline" className="bg-gray-100">Desativada</Badge>;
    }
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativa</Badge>;
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {unidades.map((unidade) => (
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
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-500">Desconto:</span>
                  <span>{unidade.percentual_desconto}%</span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-500">Consumo:</span>
                  <span>{formatarKwh(unidade.consumo_kwh)} kWh</span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-500">Data Entrada:</span>
                  <span>{formatDate(unidade.data_entrada)}</span>
                </div>

                {unidade.data_saida && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500">Data Saída:</span>
                    <span>{formatDate(unidade.data_saida)}</span>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-gray-600 text-sm line-clamp-2">{unidade.endereco}</p>
                </div>
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

  return (
    <>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número UC</TableHead>
                <TableHead>Apelido</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Consumo</TableHead>
                <TableHead>Data Entrada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow 
                  key={unidade.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewDetails(unidade)}
                >
                  <TableCell className="whitespace-nowrap">{unidade.numero_uc}</TableCell>
                  <TableCell className="whitespace-nowrap">{unidade.apelido || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">{unidade.endereco}</TableCell>
                  <TableCell className="whitespace-nowrap">{unidade.percentual_desconto}%</TableCell>
                  <TableCell className="whitespace-nowrap">{formatarKwh(unidade.consumo_kwh)} kWh</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(unidade.data_entrada)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(unidade)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap space-x-2">
                    {!unidade.data_saida ? (
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
