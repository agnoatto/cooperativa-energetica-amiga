import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const usinaFormSchema = z.object({
  investidor_id: z.string().uuid(),
  unidade_usina_id: z.string().uuid(),
  valor_kwh: z.coerce.number().positive(),
});

type UsinaFormValues = z.infer<typeof usinaFormSchema>;

interface UsinaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usinaId?: string;
  onSuccess?: () => void;
}

export function UsinaForm({ open, onOpenChange, usinaId, onSuccess }: UsinaFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UsinaFormValues>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues: {
      investidor_id: "",
      unidade_usina_id: "",
      valor_kwh: 0,
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ['investidores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investidores')
        .select('id, nome');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: unidadesUsina } = useQuery({
    queryKey: ['unidades_usina'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unidades_usina')
        .select('id, numero_uc');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (usinaId) {
      const fetchUsina = async () => {
        const { data, error } = await supabase
          .from('usinas')
          .select('*')
          .eq('id', usinaId)
          .single();

        if (error) {
          toast.error("Erro ao carregar usina");
          return;
        }

        if (data) {
          form.reset({
            investidor_id: data.investidor_id,
            unidade_usina_id: data.unidade_usina_id,
            valor_kwh: data.valor_kwh,
          });
        }
      };

      fetchUsina();
    }
  }, [usinaId, form]);

  async function onSubmit(values: UsinaFormValues) {
    try {
      setIsLoading(true);
      console.log('Submitting form with data:', values);

      const data = {
        investidor_id: values.investidor_id,
        unidade_usina_id: values.unidade_usina_id,
        valor_kwh: values.valor_kwh,
      };

      if (usinaId) {
        const { error } = await supabase
          .from('usinas')
          .update(data)
          .eq('id', usinaId);

        if (error) throw error;
        toast.success("Usina atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('usinas')
          .insert(data);

        if (error) throw error;
        toast.success("Usina cadastrada com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving usina:', error);
      toast.error(`Erro ao ${usinaId ? 'atualizar' : 'cadastrar'} usina: ` + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {usinaId ? "Editar Usina" : "Nova Usina"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="investidor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investidor</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um investidor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {investidores?.map((investidor) => (
                        <SelectItem key={investidor.id} value={investidor.id}>
                          {investidor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidade_usina_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade da Usina</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unidadesUsina?.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.numero_uc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_kwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do kWh</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}