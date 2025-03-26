
// Página de detalhes da usina
// Exibe informações completas sobre uma usina específica

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsinaById } from "./hooks/useUsinaById";
import { useUsinaPagamentos } from "./hooks/useUsinaPagamentos";
import { useUsinaPrevisoes } from "./hooks/useUsinaPrevisoes";
import { useUsinaRateios } from "./hooks/useUsinaRateios";
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { UsinaDetalheTabs } from "./components/UsinaDetalhesTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { usinaKeys } from "./hooks/useUsinas";
import { useState } from "react";

const UsinaDetalhe = () => {
  const { usinaId } = useParams<{ usinaId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);

  const { 
    data: usina, 
    isLoading: isLoadingUsina,
    isError,
    error
  } = useUsinaById(usinaId);

  const { 
    data: pagamentos, 
    isLoading: isLoadingPagamentos 
  } = useUsinaPagamentos(usinaId);

  const { 
    data: previsoes, 
    isLoading: isLoadingPrevisoes 
  } = useUsinaPrevisoes(usinaId);
  
  const {
    data: rateios,
    isLoading: isLoadingRateios
  } = useUsinaRateios(usinaId);

  const handleVoltar = () => {
    navigate("/usinas");
  };

  const handleEditar = () => {
    setOpenForm(true);
  };

  const handleSuccessEdit = () => {
    queryClient.invalidateQueries({ queryKey: usinaKeys.all });
    setOpenForm(false);
  };

  if (isError) {
    return (
      <div className="space-y-4 p-4">
        <Button variant="outline" onClick={handleVoltar} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para Usinas
        </Button>
        <div className="p-8 text-center border rounded-lg">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar usina</h3>
          <p className="mt-2 text-gray-500">{(error as Error)?.message || "Ocorreu um erro ao buscar os dados da usina."}</p>
        </div>
      </div>
    );
  }

  const isLoading = isLoadingUsina || isLoadingPagamentos || isLoadingPrevisoes || isLoadingRateios;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handleVoltar}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para Usinas
        </Button>
        
        {!isLoading && usina && (
          <Button onClick={handleEditar}>
            Editar Usina
          </Button>
        )}
      </div>

      {isLoadingUsina ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : usina ? (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Usina - {usina.unidade?.numero_uc || 'Sem UC'}
          </h1>
          
          <UsinaDetalheTabs 
            usina={usina} 
            pagamentos={pagamentos} 
            previsoes={previsoes}
            rateios={rateios}
            isLoading={isLoading}
          />
        </>
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-gray-500">Usina não encontrada</p>
        </div>
      )}

      {usinaId && (
        <UsinaForm
          open={openForm}
          onOpenChange={setOpenForm}
          usinaId={usinaId}
          onSuccess={handleSuccessEdit}
        />
      )}
    </div>
  );
};

export default UsinaDetalhe;
