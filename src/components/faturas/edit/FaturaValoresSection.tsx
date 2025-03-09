
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { UseFormReturn } from "react-hook-form";

interface FaturaValoresSectionProps {
  formState: UseFormReturn<any>;
  localTotalFatura: number;
  setLocalTotalFatura: (value: number) => void;
  localFaturaConcessionaria: number;
  setLocalFaturaConcessionaria: (value: number) => void;
  localIluminacaoPublica: number;
  setLocalIluminacaoPublica: (value: number) => void;
  localOutrosValores: number;
  setLocalOutrosValores: (value: number) => void;
}

export function FaturaValoresSection({
  formState,
  localTotalFatura,
  setLocalTotalFatura,
  localFaturaConcessionaria,
  setLocalFaturaConcessionaria,
  localIluminacaoPublica,
  setLocalIluminacaoPublica,
  localOutrosValores,
  setLocalOutrosValores,
}: FaturaValoresSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={formState.control}
          name="total_fatura"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total da Fatura</FormLabel>
              <FormControl>
                <CurrencyInput
                  placeholder="Total da fatura"
                  value={localTotalFatura}
                  onValueChange={setLocalTotalFatura}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formState.control}
          name="fatura_concessionaria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fatura da Concessionária</FormLabel>
              <FormControl>
                <CurrencyInput
                  placeholder="Valor da fatura da concessionária"
                  value={localFaturaConcessionaria}
                  onValueChange={setLocalFaturaConcessionaria}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={formState.control}
          name="iluminacao_publica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Iluminação Pública</FormLabel>
              <FormControl>
                <CurrencyInput
                  placeholder="Valor da iluminação pública"
                  value={localIluminacaoPublica}
                  onValueChange={setLocalIluminacaoPublica}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formState.control}
          name="outros_valores"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outros Valores</FormLabel>
              <FormControl>
                <CurrencyInput
                  placeholder="Outros valores"
                  value={localOutrosValores}
                  onValueChange={setLocalOutrosValores}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
