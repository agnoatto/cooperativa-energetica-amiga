
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const formSchema = z.object({
  numero_uc: z.string().min(1, "Número da UC é obrigatório"),
  apelido: z.string().optional(),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  percentual_desconto: z.string().min(1, "Percentual de desconto é obrigatório"),
  data_entrada: z.string().min(1, "Data de entrada é obrigatória"),
  data_saida: z.string().optional(),
});

type UnidadeBeneficiariaFormValues = z.infer<typeof formSchema>;

interface UnidadeBeneficiariaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadoId: string;
  unidadeId?: string;
  onSuccess?: () => void;
}

export function UnidadeBeneficiariaForm({
  open,
  onOpenChange,
  cooperadoId,
  unidadeId,
  onSuccess,
}: UnidadeBeneficiariaFormProps) {
  const form = useForm<UnidadeBeneficiariaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_uc: "",
      apelido: "",
      endereco: "",
      percentual_desconto: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_saida: "",
    },
  });

  // Fetch unidade data when editing
  useEffect(() => {
    async function fetchUnidade() {
      if (!unidadeId) return;

      try {
        const { data, error } = await supabase
          .from('unidades_beneficiarias')
          .select('*')
          .eq('id', unidadeId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            numero_uc: data.numero_uc,
            apelido: data.apelido || "",
            endereco: data.endereco,
            percentual_desconto: data.percentual_desconto.toString(),
            data_entrada: new Date(data.data_entrada).toISOString().split('T')[0],
            data_saida: data.data_saida ? new Date(data.data_saida).toISOString().split('T')[0] : "",
          });
        }
      } catch (error: any) {
        toast.error("Erro ao carregar dados da unidade: " + error.message);
      }
    }

    if (open) {
      fetchUnidade();
    }
  }, [unidadeId, open, form]);

  async function onSubmit(data: UnidadeBeneficiariaFormValues) {
    try {
      const unidadeData = {
        cooperado_id: cooperadoId,
        numero_uc: data.numero_uc,
        apelido: data.apelido || null,
        endereco: data.endereco,
        percentual_desconto: parseFloat(data.percentual_desconto),
        data_entrada: new Date(data.data_entrada).toISOString(),
        data_saida: data.data_saida ? new Date(data.data_saida).toISOString() : null,
      };

      if (unidadeId) {
        // Update existing unidade
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .update(unidadeData)
          .eq('id', unidadeId);

        if (error) throw error;
        toast.success("Unidade beneficiária atualizada com sucesso!");
      } else {
        // Create new unidade
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .insert(unidadeData);

        if (error) throw error;
        toast.success("Unidade beneficiária cadastrada com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(`Erro ao ${unidadeId ? 'atualizar' : 'cadastrar'} unidade beneficiária: ` + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {unidadeId ? "Editar Unidade Beneficiária" : "Nova Unidade Beneficiária"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numero_uc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da UC</FormLabel>
                  <FormControl>
                    <Input placeholder="Número da UC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apelido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apelido (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apelido da unidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentual_desconto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de Desconto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_entrada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_saida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Saída (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
