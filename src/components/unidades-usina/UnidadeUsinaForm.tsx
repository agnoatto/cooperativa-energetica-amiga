import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";

const unidadeUsinaFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(2, "UF é obrigatória").max(2, "UF deve ter 2 caracteres"),
  cep: z.string().min(8, "CEP é obrigatório").max(9, "CEP inválido"),
  titular_id: z.string().min(1, "Titular é obrigatório"),
});

type UnidadeUsinaFormData = z.infer<typeof unidadeUsinaFormSchema>;

interface UnidadeUsinaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadeId?: string;
  onSuccess: () => void;
}

export function UnidadeUsinaForm({
  open,
  onOpenChange,
  unidadeId,
  onSuccess,
}: UnidadeUsinaFormProps) {
  const { toast } = useToast();
  const form = useForm<UnidadeUsinaFormData>({
    resolver: zodResolver(unidadeUsinaFormSchema),
    defaultValues: {
      numero_uc: "",
      logradouro: "",
      numero: "",
      complemento: "",
      cidade: "",
      uf: "",
      cep: "",
      titular_id: "",
    },
  });

  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor");
      if (error) throw error;
      return data;
    },
  });

  React.useEffect(() => {
    if (unidadeId) {
      supabase
        .from("unidades_usina")
        .select("*")
        .eq("id", unidadeId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching unidade:", error);
            return;
          }
          if (data) {
            form.reset({
              numero_uc: data.numero_uc,
              logradouro: data.logradouro || "",
              numero: data.numero || "",
              complemento: data.complemento || "",
              cidade: data.cidade || "",
              uf: data.uf || "",
              cep: data.cep || "",
              titular_id: data.titular_id,
            });
          }
        });
    } else {
      form.reset({
        numero_uc: "",
        logradouro: "",
        numero: "",
        complemento: "",
        cidade: "",
        uf: "",
        cep: "",
        titular_id: "",
      });
    }
  }, [unidadeId, form]);

  const onSubmit = async (data: UnidadeUsinaFormData) => {
    try {
      const submitData = {
        numero_uc: data.numero_uc,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep,
        titular_id: data.titular_id,
        updated_at: new Date().toISOString(),
      };

      if (unidadeId) {
        const { error } = await supabase
          .from("unidades_usina")
          .update(submitData)
          .eq("id", unidadeId);
        if (error) throw error;
        toast({
          title: "Unidade atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("unidades_usina")
          .insert({
            ...submitData,
            status: 'draft',
            session_id: crypto.randomUUID(),
          });
        if (error) throw error;
        toast({
          title: "Unidade criada com sucesso!",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving unidade:", error);
      toast({
        title: "Erro ao salvar unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {unidadeId ? "Editar" : "Nova"} Unidade da Usina
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numero_uc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número UC</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titular_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titular</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o titular" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {investidores?.map((investidor) => (
                        <SelectItem key={investidor.id} value={investidor.id}>
                          {investidor.nome_investidor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}