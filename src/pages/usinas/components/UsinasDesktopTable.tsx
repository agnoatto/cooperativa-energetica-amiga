
// Este componente foi atualizado para permitir cliques nas linhas
// Ao clicar em uma usina, o usuário é redirecionado para a página de detalhes
// Agora também suporta scroll horizontal para melhor visualização em telas menores

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatarMoeda } from "@/utils/formatters";
import { UsinaData } from "../types";

interface UsinasDesktopTableProps {
  usinas?: UsinaData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  colunasVisiveis: string[];
}

export function UsinasDesktopTable({ 
  usinas, 
  onEdit, 
  onDelete, 
  colunasVisiveis 
}: UsinasDesktopTableProps) {
  const navigate = useNavigate();

  if (!usinas || usinas.length === 0) {
    return (
      <div className="text-center py-8 px-4 border rounded-lg">
        <p className="text-gray-500">Nenhuma usina encontrada</p>
      </div>
    );
  }
  
  const handleRowClick = (usinaId: string) => {
    navigate(`/usinas/${usinaId}`);
  };

  // Calcular a largura mínima baseada nas colunas visíveis
  const getMinWidth = () => {
    let baseWidth = 100; // Ações
    if (colunasVisiveis.includes('investidor')) baseWidth += 200;
    if (colunasVisiveis.includes('unidade')) baseWidth += 150;
    if (colunasVisiveis.includes('valor_kwh')) baseWidth += 120;
    if (colunasVisiveis.includes('status')) baseWidth += 120;
    if (colunasVisiveis.includes('potencia')) baseWidth += 150;
    if (colunasVisiveis.includes('data_inicio')) baseWidth += 150;
    
    return `${baseWidth}px`;
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full" type="always">
        <div style={{ minWidth: getMinWidth() }}>
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                {colunasVisiveis.includes('investidor') && (
                  <TableHead className="w-[200px]">Investidor</TableHead>
                )}
                {colunasVisiveis.includes('unidade') && (
                  <TableHead className="w-[150px]">Unidade (UC)</TableHead>
                )}
                {colunasVisiveis.includes('valor_kwh') && (
                  <TableHead className="w-[120px]">Valor kWh</TableHead>
                )}
                {colunasVisiveis.includes('status') && (
                  <TableHead className="w-[120px]">Status</TableHead>
                )}
                {colunasVisiveis.includes('potencia') && (
                  <TableHead className="w-[150px]">Potência Instalada</TableHead>
                )}
                {colunasVisiveis.includes('data_inicio') && (
                  <TableHead className="w-[150px]">Data de Início</TableHead>
                )}
                <TableHead className="text-right w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usinas.map((usina) => (
                <TableRow 
                  key={usina.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(usina.id)}
                >
                  {colunasVisiveis.includes('investidor') && (
                    <TableCell>{usina.investidor?.nome_investidor || '-'}</TableCell>
                  )}
                  {colunasVisiveis.includes('unidade') && (
                    <TableCell>{usina.unidade?.numero_uc || '-'}</TableCell>
                  )}
                  {colunasVisiveis.includes('valor_kwh') && (
                    <TableCell>{formatarMoeda(usina.valor_kwh)}</TableCell>
                  )}
                  {colunasVisiveis.includes('status') && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        usina.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usina.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </TableCell>
                  )}
                  {colunasVisiveis.includes('potencia') && (
                    <TableCell>
                      {usina.potencia_instalada ? `${usina.potencia_instalada} kWp` : '-'}
                    </TableCell>
                  )}
                  {colunasVisiveis.includes('data_inicio') && (
                    <TableCell>
                      {usina.data_inicio 
                        ? format(new Date(usina.data_inicio), 'dd/MM/yyyy', { locale: ptBR }) 
                        : '-'
                      }
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
                    </div>
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
