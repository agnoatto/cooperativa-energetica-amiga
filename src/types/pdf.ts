
import { Fatura } from "./fatura";

export type PdfFaturaData = Pick<
  Fatura,
  | "consumo_kwh"
  | "valor_assinatura"
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
  historico_faturas: Array<{
    mes: number;
    ano: number;
    consumo_kwh: number;
    valor_desconto: number;
  }>;
};

