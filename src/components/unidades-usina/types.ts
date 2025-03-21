
import { z } from "zod";
import { unidadeUsinaFormSchema } from "./schema";

export type UnidadeUsina = {
  id: string;
  numero_uc: string;
  apelido: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  titular_tipo: "cooperativa" | "cooperado";
  titular_id: string;
  titular_nome?: string;
  created_at: string;
  updated_at: string;
};

export type UnidadeUsinaFormData = z.infer<typeof unidadeUsinaFormSchema>;

