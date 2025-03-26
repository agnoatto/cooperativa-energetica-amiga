
// Este componente exibe as abas na página de detalhes de uma usina
// Permite navegar entre informações gerais, pagamentos, previsões e rateios

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsinaData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda } from "@/utils/formatters";
import { UsinaDadosInvestidor } from "./UsinaDadosInvestidor";
import { UsinaDadosPagamento } from "./UsinaDadosPagamento";
import { UsinaDadosUnidade } from "./UsinaDadosUnidade";
import { UsinaPagamentosTable } from "./UsinaPagamentosTable";
import { UsinaPrevisaoGeracao } from "./UsinaPrevisaoGeracao";
import { UsinaRateiosTable } from "./UsinaRateiosTable";
import { PagamentoUsina } from "../hooks/useUsinaPagamentos";
import { PrevisaoUsina } from "../hooks/useUsinaPrevisoes";
import { Rateio } from "../hooks/useUsinaRateios";

interface UsinaDetalheTabsProps {
  usina: UsinaData;
  pagamentos?: PagamentoUsina[];
  previsoes?: PrevisaoUsina[];
  rateios?: Rateio[];
  isLoading: boolean;
}

export function UsinaDetalheTabs({ 
  usina, 
  pagamentos, 
  previsoes,
  rateios,
  isLoading 
}: UsinaDetalheTabsProps) {
  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="previsoes">Previsão de Geração</TabsTrigger>
        <TabsTrigger value="rateios">Rateios</TabsTrigger>
      </TabsList>
      
      <TabsContent value="geral" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor kWh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatarMoeda(usina.valor_kwh)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {usina.status === 'active' ? 'Ativa' : 'Inativa'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Potência Instalada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usina.potencia_instalada ? `${usina.potencia_instalada} kWp` : 'Não informada'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UsinaDadosInvestidor investidor={usina.investidor} />
          <UsinaDadosUnidade unidade={usina.unidade} />
        </div>

        <UsinaDadosPagamento usina={usina} />
      </TabsContent>
      
      <TabsContent value="pagamentos">
        <UsinaPagamentosTable pagamentos={pagamentos} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="previsoes">
        <UsinaPrevisaoGeracao previsoes={previsoes} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="rateios">
        <UsinaRateiosTable 
          rateios={rateios} 
          isLoading={isLoading} 
          usinaId={usina.id}
        />
      </TabsContent>
    </Tabs>
  );
}
