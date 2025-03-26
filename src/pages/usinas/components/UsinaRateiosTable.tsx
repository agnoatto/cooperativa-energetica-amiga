
/**
 * Componente para exibir a tabela de rateios de uma usina
 * 
 * Este componente lista todos os rateios associados a uma usina específica,
 * mostrando as unidades beneficiárias e seus respectivos percentuais de rateio.
 */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Rateio } from "../hooks/useUsinaRateios";
import { Skeleton } from "@/components/ui/skeleton";
import { UsinaRateioForm } from "./UsinaRateioForm";

interface UsinaRateiosTableProps {
  rateios?: Rateio[];
  isLoading: boolean;
  usinaId?: string;
}

export function UsinaRateiosTable({ rateios, isLoading, usinaId }: UsinaRateiosTableProps) {
  const [openRateioForm, setOpenRateioForm] = useState(false);

  // Agrupar rateios por período (mesma data de início e fim)
  const rateiosPorPeriodo = React.useMemo(() => {
    if (!rateios) return [];

    // Criar chave única para cada período de rateio
    const porPeriodo = rateios.reduce((acc, rateio) => {
      const periodoKey = `${rateio.data_inicio}-${rateio.data_fim || 'atual'}`;
      
      if (!acc[periodoKey]) {
        acc[periodoKey] = {
          dataInicio: rateio.data_inicio,
          dataFim: rateio.data_fim,
          rateios: []
        };
      }
      
      acc[periodoKey].rateios.push(rateio);
      return acc;
    }, {} as Record<string, { dataInicio: string, dataFim: string | null, rateios: Rateio[] }>);
    
    // Ordenar por data de início (decrescente)
    return Object.values(porPeriodo).sort((a, b) => 
      new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
    );
  }, [rateios]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!rateios?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Rateios da Usina</h3>
          <Button 
            onClick={() => setOpenRateioForm(true)}
            disabled={!usinaId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Rateio
          </Button>
        </div>

        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">Não há rateios cadastrados para esta usina.</p>
          <Button 
            variant="outline" 
            onClick={() => setOpenRateioForm(true)} 
            className="mt-4"
            disabled={!usinaId}
          >
            Adicionar Primeiro Rateio
          </Button>
        </div>

        {usinaId && (
          <UsinaRateioForm
            open={openRateioForm}
            onOpenChange={setOpenRateioForm}
            usinaId={usinaId}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rateios da Usina</h3>
        <Button 
          onClick={() => setOpenRateioForm(true)}
          disabled={!usinaId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Rateio
        </Button>
      </div>

      {rateiosPorPeriodo.map((periodo, index) => (
        <div key={index} className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="font-medium">
                Período: {new Date(periodo.dataInicio).toLocaleDateString()}
                {periodo.dataFim 
                  ? ` até ${new Date(periodo.dataFim).toLocaleDateString()}` 
                  : " (Atual)"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {periodo.dataFim ? "Rateio Inativo" : "Rateio Ativo"}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {periodo.rateios.reduce((sum, r) => sum + r.percentual, 0).toFixed(2)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 font-medium text-sm py-2">
              <div className="col-span-2">Unidade Beneficiária</div>
              <div className="col-span-2">Cooperado</div>
              <div className="text-right">Percentual</div>
            </div>
            
            {periodo.rateios.map((rateio) => (
              <div key={rateio.id} className="grid grid-cols-5 gap-4 text-sm py-2 border-t">
                <div className="col-span-2">
                  {rateio.unidade_beneficiaria?.apelido || rateio.unidade_beneficiaria?.numero_uc || "-"}
                </div>
                <div className="col-span-2">
                  {rateio.unidade_beneficiaria?.cooperado?.nome || "-"}
                </div>
                <div className="text-right font-medium">
                  {rateio.percentual.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {usinaId && (
        <UsinaRateioForm
          open={openRateioForm}
          onOpenChange={setOpenRateioForm}
          usinaId={usinaId}
        />
      )}
    </div>
  );
}
