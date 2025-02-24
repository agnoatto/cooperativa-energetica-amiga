
import { z } from "zod";

export interface IntegracaoCoraDB {
  id?: string;
  created_at?: string;
  updated_at?: string;
  empresa_id: string;
  client_id: string;
  client_secret: string;
  ambiente: "sandbox" | "production";
  configuracoes_boleto: Record<string, any>;
}

export const integracaoCoraSchema = z.object({
  client_id: z.string().min(1, "Client ID é obrigatório"),
  client_secret: z.string().min(1, "Client Secret é obrigatório"),
  ambiente: z.enum(["sandbox", "production"]),
  configuracoes_boleto: z.object({
    instrucoes: z.array(z.string()),
    multa: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
    }),
    juros: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
    }),
    desconto: z.object({
      percentual: z.number().min(0).max(100),
      valor: z.number().min(0),
      data_limite: z.string().nullable(),
    }),
  }),
});

export type IntegracaoCoraFormValues = z.infer<typeof integracaoCoraSchema>;
