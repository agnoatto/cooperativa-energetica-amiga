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
import { BasicInfoFields } from "./BasicInfoFields";
import { ResponsavelFields } from "./ResponsavelFields";
import { ContatoFields } from "./ContatoFields";
import { cooperadoFormSchema, type CooperadoFormValues } from "./schema";

interface CooperadoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CooperadoFormValues;
  onSuccess?: () => void;
}

export function CooperadoForm({ open, onOpenChange, initialData, onSuccess }: CooperadoFormProps) {
  const form = useForm<CooperadoFormValues>({
    resolver: zodResolver(cooperadoFormSchema),
    defaultValues: initialData || {
      nome: "",
      documento: "",
      tipo_pessoa: "PF",
      telefone: "",
      email: "",
      responsavel_nome: "",
      responsavel_cpf: "",
      responsavel_telefone: "",
    },
  });

  const tipoPessoa = form.watch("tipo_pessoa");

  async function onSubmit(data: CooperadoFormValues) {
    try {
      const { error } = await supabase
        .from('cooperados')
        .insert({
          nome: data.nome,
          documento: data.documento.replace(/\D/g, ''),
          telefone: data.telefone.replace(/\D/g, ''),
          email: data.email,
          tipo_pessoa: data.tipo_pessoa,
          responsavel_nome: data.responsavel_nome,
          responsavel_cpf: data.responsavel_cpf?.replace(/\D/g, ''),
          responsavel_telefone: data.responsavel_telefone?.replace(/\D/g, ''),
        });

      if (error) throw error;

      toast.success("Cooperado cadastrado com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao cadastrar cooperado: " + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Cooperado" : "Novo Cooperado"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            {tipoPessoa === "PJ" && <ResponsavelFields form={form} />}
            <ContatoFields form={form} />

            <div className="flex justify-end gap-2">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}