
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, CheckCircle2, XCircle } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";
import { UsinaData } from "../types";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";

interface UsinasDesktopTableProps {
  usinas: UsinaData[] | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  colunasVisiveis: string[];
}

export function UsinasDesktopTable({ 
  usinas, 
  onEdit, 
  onDelete,
  colunasVisiveis,
}: UsinasDesktopTableProps) {
  const todasColunas = {
    investidor: "Investidor",
    unidade: "Unidade",
    valor_kwh: "Valor do kWh",
    status: "Status",
    potencia: "Potência Instalada",
    data_inicio: "Data de Início",
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(todasColunas).map(([key, label]) => (
              colunasVisiveis.includes(key) && (
                <TableHead key={key}>{label}</TableHead>
              )
            ))}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usinas?.map((usina) => (
            <TableRow key={usina.id}>
              {colunasVisiveis.includes('investidor') && (
                <TableCell>{usina.investidor?.nome_investidor}</TableCell>
              )}
              {colunasVisiveis.includes('unidade') && (
                <TableCell>{usina.unidade?.numero_uc}</TableCell>
              )}
              {colunasVisiveis.includes('valor_kwh') && (
                <TableCell>{formatarMoeda(usina.valor_kwh)}</TableCell>
              )}
              {colunasVisiveis.includes('status') && (
                <TableCell>
                  <Badge 
                    variant={usina.status === 'active' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {usina.status === 'active' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {usina.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
              )}
              {colunasVisiveis.includes('potencia') && (
                <TableCell>
                  {usina.potencia_instalada ? `${usina.potencia_instalada} kWp` : '-'}
                </TableCell>
              )}
              {colunasVisiveis.includes('data_inicio') && (
                <TableCell>
                  {usina.data_inicio ? formatDateToPtBR(usina.data_inicio) : '-'}
                </TableCell>
              )}
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEdit(usina.id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onDelete(usina.id)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!usinas || usinas.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                Nenhuma usina encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
