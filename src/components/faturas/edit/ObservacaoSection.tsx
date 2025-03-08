
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ObservacaoSectionProps {
  formState: UseFormReturn<any>;
}

export function ObservacaoSection({ formState }: ObservacaoSectionProps) {
  return (
    <FormField
      control={formState.control}
      name="observacao"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observação</FormLabel>
          <FormControl>
            <Input placeholder="Observação" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
