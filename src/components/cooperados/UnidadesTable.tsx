
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnidadeDetailsDialog } from "./UnidadeDetailsDialog";
import { useState } from "react";
import { formatarKwh } from "@/utils/formatters";

interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}

export function UnidadesTable({
  unidades,
  onEdit,
  onDelete,
}: UnidadesTableProps) {
  const isMobile = useIsMobile();
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleViewDetails = (unidade: any) => {
    setSelectedUnidade(unidade);
    setShowDetailsDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(unidade.id);
                  }}
                  className="h-10 w-10 p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
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
                <TableHead>Data Saída</TableHead>
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
                    {unidade.data_saida ? formatDate(unidade.data_saida) : '-'}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap space-x-2">
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
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(unidade.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
    </>
  );
}
