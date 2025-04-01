
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddressFields } from "./AddressFields";
import { UnidadeBeneficiariaBasicInfo } from "./UnidadeBeneficiariaBasicInfo";
import { UnidadeBeneficiariaDateFields } from "./UnidadeBeneficiariaDateFields";
import { GeracaoCreditosFields } from "./GeracaoCreditosFields";
import { UnidadeBeneficiariaFormProps } from "./types";
import { useUnidadeBeneficiariaForm } from "./hooks/useUnidadeBeneficiariaForm";

export function UnidadeBeneficiariaForm({
  open,
  onOpenChange,
  cooperadoId,
  unidadeId,
  onSuccess,
}: UnidadeBeneficiariaFormProps) {
  const {
    form,
    isLoadingCep,
    cooperados,
    selectedCooperadoId,
    setSelectedCooperadoId,
    fetchCep,
    onSubmit,
  } = useUnidadeBeneficiariaForm({
    cooperadoId,
    unidadeId,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {unidadeId ? "Editar Unidade Beneficiária" : "Nova Unidade Beneficiária"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da unidade beneficiária. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <FormItem className="mb-4">
                <FormLabel>Cooperado</FormLabel>
                <Select
                  value={selectedCooperadoId || undefined}
                  onValueChange={(value) => setSelectedCooperadoId(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cooperado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cooperados.map((cooperado) => (
                      <SelectItem key={cooperado.id} value={cooperado.id}>
                        {cooperado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>

              <div className="space-y-6">
                <UnidadeBeneficiariaBasicInfo form={form} />
                <AddressFields 
                  form={form}
                  isLoadingCep={isLoadingCep}
                  onFetchCep={fetchCep}
                />
                <UnidadeBeneficiariaDateFields form={form} />
                <GeracaoCreditosFields form={form} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <Button 
                type="submit" 
                className="w-full"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
