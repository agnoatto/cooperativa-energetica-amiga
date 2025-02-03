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

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  documento: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
});

type CooperadoFormValues = z.infer<typeof formSchema>;

interface CooperadoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CooperadoFormValues;
}

export function CooperadoForm({ open, onOpenChange, initialData }: CooperadoFormProps) {
  const form = useForm<CooperadoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
      documento: "",
      telefone: "",
      email: "",
    },
  });

  function onSubmit(data: CooperadoFormValues) {
    // TODO: Implementar integração com backend
    console.log(data);
    toast.success("Cooperado cadastrado com sucesso!");
    onOpenChange(false);
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
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <InputMask
                      mask={documentoMask}
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