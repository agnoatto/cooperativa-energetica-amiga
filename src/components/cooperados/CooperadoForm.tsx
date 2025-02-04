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
import { X } from "lucide-react";
import InputMask from "react-input-mask";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  documento: z.string().min(11, "CPF/CNPJ inválido"),
  tipo_pessoa: z.enum(["PF", "PJ"]),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),
});

type CooperadoFormValues = z.infer<typeof formSchema>;

interface CooperadoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CooperadoFormValues;
  onSuccess?: () => void;
}

export function CooperadoForm({ open, onOpenChange, initialData, onSuccess }: CooperadoFormProps) {
  const form = useForm<CooperadoFormValues>({
    resolver: zodResolver(formSchema),
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
      // Gerar um UUID para o novo perfil
      const profileId = crypto.randomUUID();

      // Primeiro, criar ou atualizar o perfil
      const profileData = {
        id: profileId,
        nome: data.nome,
        documento: data.documento.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        email: data.email,
        tipo_pessoa: data.tipo_pessoa,
        responsavel_nome: data.responsavel_nome,
        responsavel_cpf: data.responsavel_cpf?.replace(/\D/g, ''),
        responsavel_telefone: data.responsavel_telefone?.replace(/\D/g, ''),
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) throw profileError;

      // Em seguida, criar o cooperado vinculado ao perfil
      const { error: cooperadoError } = await supabase
        .from('cooperados')
        .insert({
          profile_id: profileId,
        });

      if (cooperadoError) throw cooperadoError;

      toast.success("Cooperado cadastrado com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao cadastrar cooperado: " + error.message);
    }
  }

  const documentoMask = form.watch("documento")?.length > 11 
    ? "99.999.999/9999-99" 
    : "999.999.999-99";

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
            <FormField
              control={form.control}
              name="tipo_pessoa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pessoa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PF">Pessoa Física</SelectItem>
                      <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoPessoa === "PJ" ? "Razão Social" : "Nome"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
                  </FormLabel>
                  <FormControl>
                    <InputMask
                      mask={documentoMask}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {(inputProps: any) => (
                        <Input
                          placeholder={tipoPessoa === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                          {...inputProps}
                        />
                      )}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipoPessoa === "PJ" && (
              <>
                <FormField
                  control={form.control}
                  name="responsavel_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsavel_cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do Responsável</FormLabel>
                      <FormControl>
                        <InputMask
                          mask="999.999.999-99"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {(inputProps: any) => (
                            <Input
                              placeholder="000.000.000-00"
                              {...inputProps}
                            />
                          )}
                        </InputMask>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsavel_telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Responsável</FormLabel>
                      <FormControl>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {(inputProps: any) => (
                            <Input
                              placeholder="(00) 00000-0000"
                              {...inputProps}
                            />
                          )}
                        </InputMask>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {(inputProps: any) => (
                        <Input
                          placeholder="(00) 00000-0000"
                          {...inputProps}
                        />
                      )}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
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