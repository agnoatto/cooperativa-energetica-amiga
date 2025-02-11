
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { UnidadeBeneficiariaFormValues } from "./types";

interface GeracaoCreditosFieldsProps {
  form: UseFormReturn<UnidadeBeneficiariaFormValues>;
}

export function GeracaoCreditosFields({ form }: GeracaoCreditosFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="possui_geracao_propria"
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
                  Possui geração própria instalada na UC?
                </FormLabel>
                <FormDescription>
                  Marque esta opção se a unidade possui sistema fotovoltaico próprio instalado
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("possui_geracao_propria") && (
          <div className="space-y-4 pl-4">
            <FormField
              control={form.control}
              name="potencia_instalada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potência Instalada (kWp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_inicio_geracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início da Geração</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacao_geracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações sobre a Geração Própria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações relevantes sobre o sistema instalado..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="recebe_creditos_proprios"
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
                  Já recebe créditos de usina própria?
                </FormLabel>
                <FormDescription>
                  Marque esta opção se a unidade já recebe créditos de uma usina própria em outro local
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("recebe_creditos_proprios") && (
          <div className="space-y-4 pl-4">
            <FormField
              control={form.control}
              name="uc_origem_creditos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UC da Usina de Origem</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Número da UC da usina que envia os créditos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_inicio_creditos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início do Recebimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacao_creditos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações sobre os Créditos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações relevantes sobre o recebimento dos créditos..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
