import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { z } from "zod";

const usinaFormSchema = z.object({
  investidor_id: z.string().uuid(),
  unidade_usina_id: z.string().uuid(),
  valor_kwh: z.number().positive(),
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
            {/* Form fields will be added here */}
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