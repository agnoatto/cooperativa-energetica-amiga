
/**
 * Componente para exibir a tabela de rateios da usina
 * 
 * Apresenta os rateios ativos e históricos de uma usina,
 * mostrando os percentuais de energia alocados para cada unidade beneficiária.
 */
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Rateio } from "../hooks/useUsinaRateios";

interface UsinaRateiosTableProps {
  rateios?: Rateio[];
  isLoading: boolean;
}

export function UsinaRateiosTable({ rateios, isLoading }: UsinaRateiosTableProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[140px] w-full rounded-lg" />
        <Skeleton className="h-[140px] w-full rounded-lg" />
        <Skeleton className="h-[140px] w-full rounded-lg" />
      </div>
    );
  }

  if (!rateios?.length) {
    return (
      <div className="text-center py-8 px-4 border rounded-lg">
        <p className="text-gray-500">Nenhum rateio encontrado para esta usina</p>
      </div>
    );
  }

  // Agrupar rateios por data de início para mostrar por períodos
  const rateiosPorPeriodo = rateios.reduce((groups, rateio) => {
    const dataInicio = rateio.data_inicio.split('T')[0]; // Apenas a data, sem a hora
    
    if (!groups[dataInicio]) {
      groups[dataInicio] = [];
    }
    
    groups[dataInicio].push(rateio);
    return groups;
  }, {} as Record<string, Rateio[]>);

  const periodos = Object.keys(rateiosPorPeriodo).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (isMobile) {
    return (
      <div className="space-y-6">
        {periodos.map(periodo => {
          const ratoeioPeriodo = rateiosPorPeriodo[periodo];
          const dataInicio = new Date(periodo);
          const somaPercentual = ratoeioPeriodo.reduce((sum, r) => sum + r.percentual, 0);
          const dataFim = ratoeioPeriodo[0]?.data_fim 
            ? new Date(ratoeioPeriodo[0].data_fim) 
            : null;
            
          return (
            <Card key={periodo} className="overflow-hidden">
              <CardHeader className="bg-slate-50 pb-2">
                <CardTitle className="text-sm font-medium flex justify-between">
                  <span>
                    Válido a partir de: {format(dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                  <span className={dataFim ? 'text-orange-600' : 'text-green-600'}>
                    {dataFim ? 'Inativo' : 'Ativo'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-3 bg-slate-100 text-sm font-medium border-y">
                  <div className="flex justify-between">
                    <span>Total alocado:</span>
                    <span>{somaPercentual.toFixed(2)}%</span>
                  </div>
                  {dataFim && (
                    <div className="flex justify-between mt-1">
                      <span>Válido até:</span>
                      <span>{format(dataFim, "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>
                
                <div className="divide-y">
                  {ratoeioPeriodo.map(rateio => (
                    <div key={rateio.id} className="p-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">UC: {rateio.unidade_beneficiaria?.numero_uc}</span>
                        <span className="font-bold">{rateio.percentual}%</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {rateio.unidade_beneficiaria?.apelido || rateio.unidade_beneficiaria?.cooperado?.nome || "Sem identificação"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {periodos.map(periodo => {
        const rateiosPeriodo = rateiosPorPeriodo[periodo];
        const dataInicio = new Date(periodo);
        const somaPercentual = rateiosPeriodo.reduce((sum, r) => sum + r.percentual, 0);
        const dataFim = rateiosPeriodo[0]?.data_fim 
          ? new Date(rateiosPeriodo[0].data_fim) 
          : null;
          
        return (
          <div key={periodo} className="border rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-4 flex justify-between items-center border-b">
              <div>
                <h3 className="font-medium">
                  Válido a partir de: {format(dataInicio, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h3>
                {dataFim && (
                  <p className="text-sm text-gray-600">
                    Válido até: {format(dataFim, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="mr-1">Total alocado:</span>
                  <span className="font-bold">{somaPercentual.toFixed(2)}%</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  dataFim ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {dataFim ? 'Inativo' : 'Ativo'}
                </span>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Unidade Consumidora</TableHead>
                  <TableHead className="w-[300px]">Identificação</TableHead>
                  <TableHead className="text-right">Percentual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateiosPeriodo.map(rateio => (
                  <TableRow key={rateio.id}>
                    <TableCell>{rateio.unidade_beneficiaria?.numero_uc}</TableCell>
                    <TableCell>
                      {rateio.unidade_beneficiaria?.apelido || 
                       rateio.unidade_beneficiaria?.cooperado?.nome || 
                       "Sem identificação"}
                    </TableCell>
                    <TableCell className="text-right font-medium">{rateio.percentual}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}
