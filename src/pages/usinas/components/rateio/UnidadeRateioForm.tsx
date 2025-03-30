
/**
 * Componente que renderiza um linha de formulário para uma unidade beneficiária no rateio
 * 
 * Este componente apresenta os campos para selecionar a unidade beneficiária
 * e definir o percentual de rateio para essa unidade.
 */
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Info } from "lucide-react";
import { ReactSelectField } from "@/components/ui/react-select";
import { UseFormReturn } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UnidadeRateioFormProps {
  form: UseFormReturn<any>;
  index: number;
  options: { value: string; label: string }[];
  isDisabled: boolean;
  isLoading?: boolean;
  onRemove: () => void;
}

export function UnidadeRateioForm({
  form,
  index,
  options,
  isDisabled,
  isLoading = false,
  onRemove
}: UnidadeRateioFormProps) {
  return (
    <div className="flex gap-4 items-start">
      <FormField
        control={form.control}
        name={`unidades.${index}.unidade_beneficiaria_id`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <div className="flex items-center gap-2">
              <ReactSelectField
                form={form}
                name={`unidades.${index}.unidade_beneficiaria_id`}
                label="Unidade Beneficiária"
                options={options}
                isLoading={isLoading}
                placeholder={isLoading ? "Carregando unidades..." : "Selecione uma unidade"}
                noOptionsMessage={() => 
                  isLoading ? "Carregando unidades..." : 
                  options.length === 0 ? "Nenhuma unidade disponível" : "Nenhuma opção encontrada"
                }
              />
              {options.length === 0 && !isLoading && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-amber-500 mt-7" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Não há unidades beneficiárias disponíveis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`unidades.${index}.percentual`}
        render={({ field }) => (
          <FormItem className="w-28">
            <FormLabel>Percentual</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value) || 0);
                  }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  %
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mt-8"
        disabled={isDisabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
