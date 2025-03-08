
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { CalculoFaturaTemplate } from "@/types/template";
import { 
  createTemplate, 
  updateTemplate, 
  resetDefaultTemplates 
} from "./services/templateService";

const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  formula_valor_desconto: z.string().min(1, { message: "Fórmula de desconto é obrigatória" }),
  formula_valor_assinatura: z.string().min(1, { message: "Fórmula de assinatura é obrigatória" }),
  is_padrao: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface CalculoFaturaTemplateFormProps {
  template: CalculoFaturaTemplate | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CalculoFaturaTemplateForm({
  template,
  onSuccess,
  onCancel
}: CalculoFaturaTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: template?.nome || "",
      descricao: template?.descricao || "",
      formula_valor_desconto: template?.formula_valor_desconto || "(total_fatura - iluminacao_publica - outros_valores) * (percentual_desconto / 100)",
      formula_valor_assinatura: template?.formula_valor_assinatura || "total_fatura - valor_desconto - fatura_concessionaria",
      is_padrao: template?.is_padrao || false
    }
  });

  const handleSave = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (values.is_padrao) {
        // Se o template está sendo marcado como padrão, remover o padrão dos outros
        await resetDefaultTemplates(template?.id || "");
      }

      if (template) {
        // Atualizar template existente
        const updatedTemplate = await updateTemplate(template.id, values);

        if (!updatedTemplate) {
          throw new Error("Erro ao atualizar o template.");
        }

        toast.success("Template atualizado com sucesso!");
      } else {
        // Criar novo template
        const newTemplate = await createTemplate(values);

        if (!newTemplate) {
          throw new Error("Erro ao criar o template.");
        }

        toast.success("Template criado com sucesso!");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao salvar template: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variaveisDisponiveis = [
    { nome: "total_fatura", descricao: "Valor total da fatura" },
    { nome: "iluminacao_publica", descricao: "Valor da iluminação pública" },
    { nome: "outros_valores", descricao: "Outros valores" },
    { nome: "fatura_concessionaria", descricao: "Valor da fatura da concessionária" },
    { nome: "valor_desconto", descricao: "Valor do desconto (disponível apenas para cálculo da assinatura)" },
    { nome: "percentual_desconto", descricao: "Percentual de desconto configurado na unidade" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="editor">Informações Básicas</TabsTrigger>
            <TabsTrigger value="help">Ajuda com Fórmulas</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do template" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome que identifica este template de cálculo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_padrao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Definir como padrão
                      </FormLabel>
                      <FormDescription>
                        Se marcado, este template será usado como padrão para novas unidades
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva como funciona este template de cálculo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            <h3 className="text-lg font-medium mb-4">Fórmulas de Cálculo</h3>

            <FormField
              control={form.control}
              name="formula_valor_desconto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fórmula para cálculo do valor de desconto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: (total_fatura - iluminacao_publica - outros_valores) * (percentual_desconto / 100)"
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Utilize as variáveis disponíveis e operadores matemáticos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formula_valor_assinatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fórmula para cálculo do valor da assinatura</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: total_fatura - valor_desconto - fatura_concessionaria"
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta fórmula é calculada após o valor_desconto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Ajuda com Fórmulas</CardTitle>
                <CardDescription>
                  Use as variáveis abaixo nas suas fórmulas de cálculo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Variáveis Disponíveis</h4>
                  <div className="grid gap-2">
                    {variaveisDisponiveis.map((variavel) => (
                      <div key={variavel.nome} className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono">
                          {variavel.nome}
                        </code>
                        <span>-</span>
                        <span className="text-sm text-muted-foreground">
                          {variavel.descricao}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Exemplos</h4>
                  <div className="space-y-2">
                    <p className="text-sm">Desconto Padrão:</p>
                    <code className="bg-muted p-2 rounded block font-mono text-sm">
                      (total_fatura - iluminacao_publica - outros_valores) * (percentual_desconto / 100)
                    </code>
                    
                    <p className="text-sm mt-4">Desconto sobre o valor total:</p>
                    <code className="bg-muted p-2 rounded block font-mono text-sm">
                      total_fatura * (percentual_desconto / 100)
                    </code>
                    
                    <p className="text-sm mt-4">Cálculo de assinatura padrão:</p>
                    <code className="bg-muted p-2 rounded block font-mono text-sm">
                      total_fatura - valor_desconto - fatura_concessionaria
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {template ? "Atualizar" : "Criar"} Template
          </Button>
        </div>
      </form>
    </Form>
  );
}
