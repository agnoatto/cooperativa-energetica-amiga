
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { InvestidorFormFields } from "./InvestidorFormFields";
import { investidorFormSchema, type InvestidorFormData } from "./types";
import { Loader2 } from "lucide-react";

interface InvestidorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investidorId?: string;
  onSuccess: () => void;
}

export function InvestidorForm({
  open,
  onOpenChange,
  investidorId,
  onSuccess,
}: InvestidorFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<InvestidorFormData>({
    resolver: zodResolver(investidorFormSchema),
    defaultValues: {
      nome_investidor: "",
      documento: "",
      telefone: "",
      email: "",
    },
  });

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        nome_investidor: "",
        documento: "",
        telefone: "",
        email: "",
      });
    }
    onOpenChange(open);
  };

  React.useEffect(() => {
    if (open && investidorId) {
      setIsLoading(true);
      Promise.resolve(
        supabase
          .from("investidores")
          .select("*")
          .eq("id", investidorId)
          .single()
      ).then(({ data, error }) => {
        if (error) {
          console.error("Error fetching investidor:", error);
          toast({
            title: "Erro ao carregar investidor",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        if (data) {
          form.reset({
            nome_investidor: data.nome_investidor,
            documento: data.documento,
            telefone: data.telefone || "",
            email: data.email || "",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else if (open) {
      // Reset form when opening for new record
      form.reset({
        nome_investidor: "",
        documento: "",
        telefone: "",
        email: "",
      });
    }
  }, [investidorId, form, open, toast]);

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      setIsLoading(true);
      const submitData = {
        nome_investidor: data.nome_investidor,
        documento: data.documento.replace(/\D/g, ""),
        telefone: data.telefone ? data.telefone.replace(/\D/g, "") : null,
        email: data.email || null,
        updated_at: new Date().toISOString(),
      };

      if (investidorId) {
        const { error } = await supabase
          .from("investidores")
          .update(submitData)
          .eq("id", investidorId);
        if (error) throw error;
        toast({
          title: "Investidor atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("investidores")
          .insert({
            ...submitData,
            session_id: crypto.randomUUID(),
          });
        if (error) throw error;
        toast({
          title: "Investidor criado com sucesso!",
        });
      }
      onSuccess();
      handleOpenChange(false);
    } catch (error: any) {
      console.error("Error saving investidor:", error);
      toast({
        title: "Erro ao salvar investidor",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {investidorId ? "Editar" : "Novo"} Investidor
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InvestidorFormFields form={form} />
            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
