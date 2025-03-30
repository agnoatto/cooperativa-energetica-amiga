
/**
 * Componente de formulário para criação e edição de rateios de usina
 * 
 * Este componente permite adicionar novos rateios para uma usina,
 * distribuindo percentuais entre unidades beneficiárias selecionadas.
 * Rateios com data de início já definida não podem ser editados.
 */
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { useUsinaRateioForm } from "../hooks/useUsinaRateioForm";
import { UnidadeRateioForm } from "./rateio/UnidadeRateioForm";
import { TotalPercentualIndicator } from "./rateio/TotalPercentualIndicator";
import { RateioAtivoAviso } from "./rateio/RateioAtivoAviso";

interface UsinaRateioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usinaId: string;
  rateioId?: string;
}

export function UsinaRateioForm({ open, onOpenChange, usinaId, rateioId }: UsinaRateioFormProps) {
  const {
    form,
    totalPercentual,
    rateiosAtivos,
    isPending,
    isLoadingUnidades,
    getUnidadesOptions,
    handleSubmit,
    adicionarUnidade,
    removerUnidade,
    unidadesBeneficiarias
  } = useUsinaRateioForm({ usinaId, onOpenChange });

  console.log("Unidades beneficiárias carregadas:", unidadesBeneficiarias?.length || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Rateio</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="data_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Unidades Beneficiárias</h4>
                <TotalPercentualIndicator total={totalPercentual} />
              </div>

              {rateiosAtivos && rateiosAtivos.length > 0 && (
                <RateioAtivoAviso />
              )}

              {isLoadingUnidades ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Carregando unidades beneficiárias...</span>
                </div>
              ) : (
                <>
                  {form.getValues().unidades.map((_, index) => (
                    <UnidadeRateioForm
                      key={index}
                      form={form}
                      index={index}
                      options={getUnidadesOptions(index)}
                      isLoading={isLoadingUnidades}
                      isDisabled={form.getValues().unidades.length === 1}
                      onRemove={() => removerUnidade(index)}
                    />
                  ))}
                </>
              )}
              
              {form.formState.errors.unidades && typeof form.formState.errors.unidades.message === 'string' && (
                <div className="text-red-500 text-sm">{form.formState.errors.unidades.message}</div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarUnidade}
                disabled={
                  isLoadingUnidades || 
                  isPending || 
                  !unidadesBeneficiarias?.length || 
                  form.getValues().unidades.map(u => u.unidade_beneficiaria_id).filter(Boolean).length >= (unidadesBeneficiarias?.length || 0)
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Unidade
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || isLoadingUnidades}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                    Salvando...
                  </>
                ) : "Salvar Rateio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
