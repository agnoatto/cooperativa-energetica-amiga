
/**
 * Página de Formulário de Transferência
 * 
 * Esta página permite criar novas transferências entre contas,
 * depósitos ou saques, com opções para anexar comprovantes
 * e registrar informações detalhadas.
 */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ContaBancariaSelect } from "@/components/contas-bancos/ContaBancariaSelect";
import { ArrowLeftRight, ArrowLeft, Save, Upload } from "lucide-react";
import { useTransferencias } from "@/hooks/contas-bancos/useTransferencias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContaBancaria } from "@/types/contas-bancos";
import { format } from "date-fns";

// Esquema de validação do formulário
const transferenciaSchema = z.object({
  tipo: z.enum(["interna", "entrada", "saida"]),
  conta_origem_id: z.string().optional(),
  conta_destino_id: z.string().optional(),
  valor: z.number().positive("Valor deve ser maior que zero"),
  data_transferencia: z.date(),
  descricao: z.string().optional(),
  observacao: z.string().optional(),
  comprovante: z.any().optional(), // Será implementado quando tivermos storage
}).refine(data => {
  if (data.tipo === 'interna') {
    return !!data.conta_origem_id && !!data.conta_destino_id && data.conta_origem_id !== data.conta_destino_id;
  } else if (data.tipo === 'entrada') {
    return !!data.conta_destino_id;
  } else if (data.tipo === 'saida') {
    return !!data.conta_origem_id;
  }
  return false;
}, {
  message: "Selecione as contas de acordo com o tipo de transferência",
  path: ["tipo"]
});

type TransferenciaFormValues = z.infer<typeof transferenciaSchema>;

export default function TransferenciaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contaOrigem, setContaOrigem] = useState<ContaBancaria | undefined>(undefined);
  const [contaDestino, setContaDestino] = useState<ContaBancaria | undefined>(undefined);
  
  // Hooks para transferências
  const { realizarTransferencia } = useTransferencias();
  
  // Valores padrão para o formulário
  const defaultValues: Partial<TransferenciaFormValues> = {
    tipo: "interna",
    valor: 0,
    data_transferencia: new Date(),
  };
  
  const form = useForm<TransferenciaFormValues>({
    resolver: zodResolver(transferenciaSchema),
    defaultValues,
  });
  
  const tipoAtual = form.watch("tipo");
  
  const onSubmit = async (values: TransferenciaFormValues) => {
    setIsSubmitting(true);
    try {
      // Preparar dados para submissão
      const transferencia = {
        conta_origem_id: values.conta_origem_id,
        conta_destino_id: values.conta_destino_id,
        valor: values.valor,
        data_transferencia: values.data_transferencia.toISOString(),
        descricao: values.descricao,
        observacao: values.observacao,
        status: 'pendente'
      };
      
      const resultado = await realizarTransferencia(transferencia);
      
      if (resultado) {
        toast.success("Transferência registrada com sucesso!");
        navigate('/financeiro/contas-bancos/transferencias');
      }
    } catch (error) {
      console.error("Erro ao registrar transferência:", error);
      toast.error("Erro ao registrar transferência");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/financeiro/contas-bancos/transferencias')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-blue-600" />
            Nova Transferência
          </h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações da Transferência</CardTitle>
          <CardDescription>
            Preencha os dados para registrar uma transferência, depósito ou saque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operação</FormLabel>
                    <FormControl>
                      <Tabs 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Resetar contas ao mudar o tipo
                          if (value === 'entrada') {
                            form.setValue('conta_origem_id', undefined);
                          } else if (value === 'saida') {
                            form.setValue('conta_destino_id', undefined);
                          }
                        }}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="interna">Transferência</TabsTrigger>
                          <TabsTrigger value="entrada">Depósito/Entrada</TabsTrigger>
                          <TabsTrigger value="saida">Saque/Saída</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormDescription>
                      Selecione o tipo de operação financeira que deseja registrar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(tipoAtual === 'interna' || tipoAtual === 'saida') && (
                  <FormField
                    control={form.control}
                    name="conta_origem_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta de Origem</FormLabel>
                        <FormControl>
                          <ContaBancariaSelect
                            value={field.value || ""}
                            onChange={field.onChange}
                            onContaSelected={setContaOrigem}
                            placeholder="Selecione a conta de origem"
                          />
                        </FormControl>
                        <FormDescription>
                          {contaOrigem ? `Saldo disponível: ${format(contaOrigem.saldo_atual, 'currency', { currency: 'BRL' })}` : 'Conta de onde sairá o dinheiro'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {(tipoAtual === 'interna' || tipoAtual === 'entrada') && (
                  <FormField
                    control={form.control}
                    name="conta_destino_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta de Destino</FormLabel>
                        <FormControl>
                          <ContaBancariaSelect
                            value={field.value || ""}
                            onChange={field.onChange}
                            onContaSelected={setContaDestino}
                            placeholder="Selecione a conta de destino"
                          />
                        </FormControl>
                        <FormDescription>
                          Conta que receberá o dinheiro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0,00" 
                            className="pl-9"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Valor da transferência
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="data_transferencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Transferência *</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione uma data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descrição curta da transferência" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Uma breve descrição para identificação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comprovante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Arraste um arquivo ou clique para anexar comprovante
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, JPG, PNG até 5MB
                        </p>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("O arquivo deve ter no máximo 5MB");
                                return;
                              }
                              field.onChange(file);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            const input = document.querySelector('input[type="file"]');
                            if (input) {
                              (input as HTMLInputElement).click();
                            }
                          }}
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/financeiro/contas-bancos/transferencias')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Registrando..." : "Registrar Transferência"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
