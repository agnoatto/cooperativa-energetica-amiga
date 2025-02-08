
import { Fatura, StatusHistoryEntry } from "./fatura";

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
  | "saldo_energia_kwh"
  | "historico_status"
  | "observacao"
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
