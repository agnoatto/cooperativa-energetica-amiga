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
  initialData?: UnidadeBeneficiariaFormValues;
  onSuccess?: () => void;
}

export function UnidadeBeneficiariaForm({
  open,
  onOpenChange,
  cooperadoId,
  initialData,
  onSuccess,
}: UnidadeBeneficiariaFormProps) {
  const form = useForm<UnidadeBeneficiariaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      numero_uc: "",
      apelido: "",
      endereco: "",
      percentual_desconto: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_saida: "",
    },
  });

  async function onSubmit(data: UnidadeBeneficiariaFormValues) {
    try {
      const { error } = await supabase
        .from('unidades_beneficiarias')
        .insert({
          cooperado_id: cooperadoId,
          numero_uc: data.numero_uc,
          apelido: data.apelido || null,
          endereco: data.endereco,
          percentual_desconto: parseFloat(data.percentual_desconto),
          data_entrada: new Date(data.data_entrada).toISOString(),
          data_saida: data.data_saida ? new Date(data.data_saida).toISOString() : null,
        });

      if (error) throw error;

      toast.success("Unidade beneficiária cadastrada com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao cadastrar unidade beneficiária: " + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Unidade Beneficiária" : "Nova Unidade Beneficiária"}
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