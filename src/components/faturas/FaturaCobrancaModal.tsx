
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "./CurrencyInput";
import { useState, useEffect } from "react";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  valor: z.string().min(1, "Valor é obrigatório"),
  dataVencimento: z.date().optional(),
  observacao: z.string().optional(),
  enviarNotificacao: z.boolean().default(false),
  aplicarJuros: z.boolean().default(false),
  valorJuros: z.string().optional(),
  aplicarMulta: z.boolean().default(false),
  valorMulta: z.string().optional(),
  aplicarDesconto: z.boolean().default(false),
  valorDesconto: z.string().optional(),
  dataLimiteDesconto: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FaturaCobrancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaId: string;
  onSuccess: () => void;
  dataVencimentoOriginal?: Date;
}

export function FaturaCobrancaModal({
  isOpen,
  onClose,
  faturaId,
  onSuccess,
  dataVencimentoOriginal
}: FaturaCobrancaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valor: "0",
      observacao: "",
      enviarNotificacao: false,
      aplicarJuros: false,
      valorJuros: "0",
      aplicarMulta: false,
      valorMulta: "0",
      aplicarDesconto: false,
      valorDesconto: "0",
      dataVencimento: dataVencimentoOriginal || undefined,
    },
  });

  useEffect(() => {
    if (dataVencimentoOriginal) {
      form.setValue("dataVencimento", dataVencimentoOriginal);
    }
  }, [dataVencimentoOriginal, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const updateData: Record<string, any> = {
        valor_adicional: Number(values.valor),
        observacao: values.observacao || null,
      };

      if (values.dataVencimento) {
        updateData.data_vencimento = format(values.dataVencimento, 'yyyy-MM-dd');
      }

      // Adicionar dados de juros, multa e desconto conforme configurado
      if (values.aplicarJuros && values.valorJuros) {
        updateData.juros = Number(values.valorJuros);
      }

      if (values.aplicarMulta && values.valorMulta) {
        updateData.multa = Number(values.valorMulta);
      }

      if (values.aplicarDesconto && values.valorDesconto) {
        updateData.desconto = Number(values.valorDesconto);
        if (values.dataLimiteDesconto) {
          updateData.data_limite_desconto = format(values.dataLimiteDesconto, 'yyyy-MM-dd');
        }
      }

      const { error } = await supabase
        .from('faturas')
        .update(updateData)
        .eq('id', faturaId);

      if (error) throw error;

      // Se a opção de enviar notificação estiver marcada, registre no histórico
      if (values.enviarNotificacao) {
        // Buscar o histórico atual
        const { data: faturaAtual } = await supabase
          .from('faturas')
          .select('historico_status')
          .eq('id', faturaId)
          .single();

        const historicoAtual = faturaAtual?.historico_status || [];
        
        // Adicionar evento de notificação ao histórico
        const novoHistorico = [
          ...historicoAtual,
          {
            data: new Date().toISOString(),
            status: 'notificado',
            observacao: 'Notificação de cobrança enviada automaticamente'
          }
        ];

        await supabase
          .from('faturas')
          .update({ historico_status: novoHistorico })
          .eq('id', faturaId);
      }

      toast.success('Cobrança atualizada com sucesso');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error);
      toast.error('Erro ao atualizar cobrança');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Cobrança</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Adicional</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id="valor"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataVencimento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aplicarJuros"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aplicar Juros</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("aplicarJuros") && (
                <FormField
                  control={form.control}
                  name="valorJuros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor dos Juros (%)</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || "0"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aplicarMulta"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aplicar Multa</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("aplicarMulta") && (
                <FormField
                  control={form.control}
                  name="valorMulta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Multa (%)</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || "0"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aplicarDesconto"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aplicar Desconto</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("aplicarDesconto") && (
                <FormField
                  control={form.control}
                  name="valorDesconto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Desconto (%)</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || "0"}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {form.watch("aplicarDesconto") && (
              <FormField
                control={form.control}
                name="dataLimiteDesconto"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Limite para Desconto</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="enviarNotificacao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enviar Notificação ao Cooperado</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observação sobre a cobrança"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
