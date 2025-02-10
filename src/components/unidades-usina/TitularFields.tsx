
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";
import { useUnidadeUsinaData } from "./hooks/useUnidadeUsinaData";

export function TitularFields() {
  const form = useFormContext();
  const { cooperativas, cooperados } = useUnidadeUsinaData();

  return (
    <>
      <FormField
        control={form.control}
        name="titular_tipo"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de Titular</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="cooperativa" />
                  </FormControl>
                  <FormLabel className="font-normal">Cooperativa</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="cooperado" />
                  </FormControl>
                  <FormLabel className="font-normal">Cooperado</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="titular_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titular</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o titular" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {form.watch("titular_tipo") === "cooperativa"
                  ? cooperativas?.map((cooperativa) => (
                      <SelectItem key={cooperativa.id} value={cooperativa.id}>
                        {cooperativa.nome} ({cooperativa.documento})
                      </SelectItem>
                    ))
                  : cooperados?.map((cooperado) => (
                      <SelectItem key={cooperado.id} value={cooperado.id}>
                        {cooperado.nome}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
