
import { Fatura } from "./fatura";

export type PdfBoxConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: string;
};

export type PdfFaturaData = Pick<
  Fatura,
  | "consumo_kwh"
  | "valor_total"
  | "status"
  | "data_vencimento"
  | "mes"
  | "ano"
  | "fatura_concessionaria"
  | "total_fatura"
  | "iluminacao_publica"
  | "outros_valores"
  | "valor_desconto"
  | "economia_acumulada"
> & {
  unidade_beneficiaria: {
    numero_uc: string;
    apelido: string | null;
    endereco: string;
    percentual_desconto: number;
    cooperado: {
      nome: string;
      documento: string | null;
    };
  };
};
