
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { useState } from "react";
import { calculateValues } from "./utils/calculateValues";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EditFaturaModalProps {
  fatura: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isProcessing: boolean;
}

const formSchema = z.object({
  consumo_kwh: z.string().min(1, { message: "Consumo é obrigatório" }),
  valor_assinatura: z.string().min(1, { message: "Valor da assinatura é obrigatório" }),
  data_vencimento: z.string().min(1, { message: "Data de vencimento é obrigatória" }),
  fatura_concessionaria: z.string().min(1, { message: "Valor da concessionária é obrigatório" }),
  total_fatura: z.string().min(1, { message: "Total da fatura é obrigatório" }),
  iluminacao_publica: z.string().min(1, { message: "Iluminação pública é obrigatória" }),
  outros_valores: z.string().min(1, { message: "Outros valores são obrigatórios" }),
  valor_desconto: z.string().optional(),
  economia_acumulada: z.string().optional(),
  saldo_energia_kwh: z.string().optional(),
  observacao: z.string().optional(),
});

export function EditFaturaModal({
  fatura,
  isOpen,
  onClose,
  onSave,
  isProcessing
}: EditFaturaModalProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Estado para valores locais
  const [localTotalFatura, setLocalTotalFatura] = useState(fatura?.total_fatura.toString() || "0");
  const [localIluminacaoPublica, setLocalIluminacaoPublica] = useState(fatura?.iluminacao_publica.toString() || "0");
  const [localOutrosValores, setLocalOutrosValores] = useState(fatura?.outros_valores.toString() || "0");
  const [localFaturaConcessionaria, setLocalFaturaConcessionaria] = useState(fatura?.fatura_concessionaria.toString() || "0");
  const [localValorDesconto, setLocalValorDesconto] = useState(fatura?.valor_desconto.toString() || "0");
  const [localValorAssinatura, setLocalValorAssinatura] = useState(fatura?.valor_assinatura.toString() || "0");
  
  const handleCalcularClick = async () => {
    if (!fatura) return;
    
    setIsCalculating(true);
    try {
      // Buscar o percentual de desconto da unidade
      const { data: unidade, error } = await supabase
        .from('unidades_beneficiarias')
        .select('percentual_desconto')
        .eq('id', fatura.unidade_beneficiaria.id)
        .single();
      
      if (error) throw error;
      
      const percentualDesconto = unidade?.percentual_desconto || 0;
      
      // Chamar a função de cálculo com o ID da unidade
      const valores = await calculateValues(
        localTotalFatura,
        localIluminacaoPublica,
        localOutrosValores,
        localFaturaConcessionaria,
        percentualDesconto,
        fatura.unidade_beneficiaria.id
      );
      
      setLocalValorDesconto(valores.valor_desconto.toString());
      setLocalValorAssinatura(valores.valor_assinatura.toString());
    } catch (error) {
      console.error('Erro ao calcular valores:', error);
      toast.error('Erro ao calcular valores. Verifique o console para mais detalhes.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formState = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consumo_kwh: fatura?.consumo_kwh.toString() || "0",
      valor_assinatura: fatura?.valor_assinatura.toString() || "0",
      data_vencimento: fatura?.data_vencimento || "",
      fatura_concessionaria: fatura?.fatura_concessionaria.toString() || "0",
      total_fatura: fatura?.total_fatura.toString() || "0",
      iluminacao_publica: fatura?.iluminacao_publica.toString() || "0",
      outros_valores: fatura?.outros_valores.toString() || "0",
      valor_desconto: fatura?.valor_desconto.toString() || "0",
      economia_acumulada: fatura?.economia_acumulada.toString() || "0",
      saldo_energia_kwh: fatura?.saldo_energia_kwh.toString() || "0",
      observacao: fatura?.observacao || "",
    },
    mode: "onChange",
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (values: any) => {
    const data = {
      id: fatura.id,
      consumo_kwh: Number(values.consumo_kwh),
      valor_assinatura: Number(localValorAssinatura),
      data_vencimento: formatDate(values.data_vencimento),
      fatura_concessionaria: Number(values.fatura_concessionaria),
      total_fatura: Number(values.total_fatura),
      iluminacao_publica: Number(values.iluminacao_publica),
      outros_valores: Number(values.outros_valores),
      valor_desconto: Number(localValorDesconto),
      economia_acumulada: Number(values.economia_acumulada),
      saldo_energia_kwh: Number(values.saldo_energia_kwh),
      observacao: values.observacao,
    };

    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para atualizar os dados da fatura.
          </DialogDescription>
        </DialogHeader>

        <Form {...formState}>
          <form onSubmit={formState.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={formState.control}
                name="consumo_kwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumo (kWh)</FormLabel>
                    <FormControl>
                      <Input placeholder="Consumo em kWh" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formState.control}
                name="data_vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} defaultValue={formatDate(fatura?.data_vencimento)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={formState.control}
                name="total_fatura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total da Fatura</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Total da fatura"
                        value={localTotalFatura}
                        onValueChange={setLocalTotalFatura}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formState.control}
                name="fatura_concessionaria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fatura da Concessionária</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Valor da fatura da concessionária"
                        value={localFaturaConcessionaria}
                        onValueChange={setLocalFaturaConcessionaria}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={formState.control}
                name="iluminacao_publica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Iluminação Pública</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Valor da iluminação pública"
                        value={localIluminacaoPublica}
                        onValueChange={setLocalIluminacaoPublica}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formState.control}
                name="outros_valores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outros Valores</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Outros valores"
                        value={localOutrosValores}
                        onValueChange={setLocalOutrosValores}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={formState.control}
                  name="valor_desconto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Desconto</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Valor do desconto"
                          value={localValorDesconto}
                          onValueChange={setLocalValorDesconto}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={formState.control}
                  name="valor_assinatura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Assinatura</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Valor da assinatura"
                          value={localValorAssinatura}
                          onValueChange={setLocalValorAssinatura}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="button" onClick={handleCalcularClick} disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calcular
            </Button>

            <FormField
              control={formState.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Input placeholder="Observação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
