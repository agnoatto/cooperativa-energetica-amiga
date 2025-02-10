
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export function UCNumberField() {
  const form = useFormContext();

  return (
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
  );
}
