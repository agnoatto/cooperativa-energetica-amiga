
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateFieldsProps } from "./types";
import { cn } from "@/lib/utils";
import { convertLocalToUTC, convertUTCToLocal } from "@/utils/dateFormatters";

export function UnidadeBeneficiariaDateFields({ form }: DateFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="data_entrada"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de Entrada</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={convertUTCToLocal(field.value)}
                onChange={(e) => field.onChange(convertLocalToUTC(e.target.value))}
                className={cn(
                  "w-full",
                  !field.value && "text-muted-foreground"
                )}
              />
            </FormControl>
            <FormDescription>
              Data em que a unidade começou a participar do programa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
