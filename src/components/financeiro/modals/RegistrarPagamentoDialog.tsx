
/**
 * Diálogo para registrar pagamento de lançamentos financeiros
 * 
 * Este componente permite registrar um pagamento com valores de juros,
 * descontos e observações. É utilizado tanto nas contas a receber quanto
 * nas contas a pagar.
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUpdateLancamentoStatus } from "@/hooks/lancamentos/useUpdateLancamentoStatus";
import { formatarMoeda } from "@/utils/formatters";
import { toast } from "sonner";

// Schema para validação do formulário
const registrarPagamentoSchema = z.object({
  valorPago: z.number().positive("Valor deve ser maior que zero"),
  valorJuros: z.number().min(0, "Valor não pode ser negativo").optional(),
  valorDesconto: z.number().min(0, "Valor não pode ser negativo").optional(),
  dataPagamento: z.date(),
  observacao: z.string().optional(),
});

type RegistrarPagamentoFormValues = z.infer<typeof registrarPagamentoSchema>;

interface RegistrarPagamentoDialogProps {
  lancamento: LancamentoFinanceiro;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrarPagamentoDialog({
  lancamento,
  isOpen,
  onClose,
  onSuccess,
}: RegistrarPagamentoDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { registrarPagamento } = useUpdateLancamentoStatus();

  // Valores iniciais do formulário
  const defaultValues: Partial<RegistrarPagamentoFormValues> = {
    valorPago: lancamento.valor,
    valorJuros: 0,
    valorDesconto: 0,
    dataPagamento: new Date(),
    observacao: "",
  };

  const form = useForm<RegistrarPagamentoFormValues>({
    resolver: zodResolver(registrarPagamentoSchema),
    defaultValues,
  });

  // Calcular valor líquido (valor pago - juros + desconto)
  const valorPago = form.watch("valorPago") || 0;
  const valorJuros = form.watch("valorJuros") || 0;
  const valorDesconto = form.watch("valorDesconto") || 0;
  const valorLiquido = valorPago - valorJuros + valorDesconto;

  const onSubmit = async (data: RegistrarPagamentoFormValues) => {
    setIsProcessing(true);
    try {
      const success = await registrarPagamento(
        lancamento,
        data.valorPago,
        data.valorJuros || 0,
        data.valorDesconto || 0,
        data.dataPagamento.toISOString(),
        data.observacao
      );

      if (success) {
        toast.success("Pagamento registrado com sucesso!");
        onSuccess();
      } else {
        toast.error("Erro ao registrar pagamento.");
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Ocorreu um erro ao registrar o pagamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valorPago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Pago</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0,00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataPagamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Pagamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) field.onChange(date);
                          }}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valorJuros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Juros</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0,00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorDesconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0,00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o pagamento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium">Resumo</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>Valor Pago:</div>
                <div className="text-right">{formatarMoeda(valorPago)}</div>
                <div>Juros:</div>
                <div className="text-right">{formatarMoeda(valorJuros)}</div>
                <div>Desconto:</div>
                <div className="text-right">{formatarMoeda(valorDesconto)}</div>
                <div className="font-medium">Valor Líquido:</div>
                <div className="text-right font-medium">
                  {formatarMoeda(valorLiquido)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pagamento"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
