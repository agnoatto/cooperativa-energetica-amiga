
import { useTheme } from "next-themes";
import ReactSelect, { Props as ReactSelectProps } from "react-select";
import AsyncReactSelect from "react-select/async";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { UseFormReturn } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface ReactSelectFieldProps extends Omit<ReactSelectProps<Option>, "form"> {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  options?: Option[];
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  isAsync?: boolean;
}

export function ReactSelectField({
  form,
  name,
  label,
  options,
  loadOptions,
  isAsync = false,
  className,
  ...props
}: ReactSelectFieldProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDark ? "hsl(var(--background))" : "white",
      borderColor: state.isFocused
        ? "hsl(var(--primary))"
        : "hsl(var(--border))",
      boxShadow: state.isFocused
        ? "0 0 0 1px hsl(var(--primary))"
        : "none",
      "&:hover": {
        borderColor: "hsl(var(--primary))",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "hsl(var(--background))" : "white",
      border: "1px solid hsl(var(--border))",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
        ? isDark
          ? "hsl(var(--accent))"
          : "hsl(var(--accent)/.1)"
        : "transparent",
      color: state.isSelected
        ? "white"
        : isDark
        ? "hsl(var(--foreground))"
        : "inherit",
      "&:hover": {
        backgroundColor: state.isSelected
          ? "hsl(var(--primary))"
          : "hsl(var(--accent)/.1)",
      },
    }),
  };

  const SelectComponent = isAsync ? AsyncReactSelect : ReactSelect;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <SelectComponent
              {...props}
              {...field}
              value={
                options?.find((option) => option.value === field.value) || null
              }
              onChange={(option: Option | null) => {
                field.onChange(option?.value);
              }}
              options={options}
              loadOptions={loadOptions}
              styles={customStyles}
              className="react-select"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
