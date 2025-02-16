
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeracaoPrevisaoFormData, geracaoPrevisaoSchema } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface GeracaoPrevisaoDialogProps {
  usinaId?: string;
}

const meses = [
  { nome: "Janeiro", campo: "janeiro" },
  { nome: "Fevereiro", campo: "fevereiro" },
  { nome: "Março", campo: "marco" },
  { nome: "Abril", campo: "abril" },
  { nome: "Maio", campo: "maio" },
  { nome: "Junho", campo: "junho" },
  { nome: "Julho", campo: "julho" },
  { nome: "Agosto", campo: "agosto" },
  { nome: "Setembro", campo: "setembro" },
  { nome: "Outubro", campo: "outubro" },
  { nome: "Novembro", campo: "novembro" },
  { nome: "Dezembro", campo: "dezembro" },
] as const;

export function GeracaoPrevisaoDialog({ usinaId }: GeracaoPrevisaoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Busca os dados da usina para obter a data de início
  const { data: usina, refetch } = useQuery({
    queryKey: ['usina', usinaId],
    queryFn: async () => {
      if (!usinaId) return null;
      const { data, error } = await supabase
        .from('usinas')
        .select('*')
        .eq('id', usinaId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!usinaId,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Efeito para recarregar os dados quando o diálogo for aberto
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      refetch();
    }
    setOpen(isOpen);
  };

  const form = useForm<GeracaoPrevisaoFormData>({
    resolver: zodResolver(geracaoPrevisaoSchema),
    defaultValues: {
      janeiro: 0,
      fevereiro: 0,
      marco: 0,
      abril: 0,
      maio: 0,
      junho: 0,
      julho: 0,
      agosto: 0,
      setembro: 0,
      outubro: 0,
      novembro: 0,
      dezembro: 0,
    },
  });

  const onSubmit = async (data: GeracaoPrevisaoFormData) => {
    if (!usinaId || !usina?.data_inicio) {
      toast.error("Data de início da usina não definida");
      return;
    }

    setIsLoading(true);
    try {
      const anoInstalacao = new Date(usina.data_inicio).getFullYear();

      const { error } = await supabase
        .from('geracao_prevista_usina')
        .upsert({
          ano: anoInstalacao,
          usina_id: usinaId,
          janeiro: data.janeiro || 0,
          fevereiro: data.fevereiro || 0,
          marco: data.marco || 0,
          abril: data.abril || 0,
          maio: data.maio || 0,
          junho: data.junho || 0,
          julho: data.julho || 0,
          agosto: data.agosto || 0,
          setembro: data.setembro || 0,
          outubro: data.outubro || 0,
          novembro: data.novembro || 0,
          dezembro: data.dezembro || 0,
        });

      if (error) throw error;

      toast.success("Previsão de geração salva com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar previsão:", error);
      toast.error("Erro ao salvar previsão de geração");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" disabled={!usina?.data_inicio} onClick={() => refetch()}>
          Previsão de Geração
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Previsão de Geração Mensal - {usina?.data_inicio ? `Ano de Instalação: ${new Date(usina.data_inicio).getFullYear()}` : 'Data de início não definida'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {meses.map(({ nome, campo }) => (
              <div key={campo} className="space-y-2">
                <Label>{nome}</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...form.register(campo as any, { valueAsNumber: true })}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isLoading || !usinaId || !usina?.data_inicio}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Previsão"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
