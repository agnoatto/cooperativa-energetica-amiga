
export interface FaturaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: {
    id: string;
    consumo_kwh: number | null;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    saldo_energia_kwh: number | null;
    observacao: string | null;
    data_vencimento: string;
    arquivo_concessionaria_nome?: string | null;
    arquivo_concessionaria_path?: string | null;
    arquivo_concessionaria_tipo?: string | null;
    arquivo_concessionaria_tamanho?: number | null;
    unidade_beneficiaria: {
      percentual_desconto: number;
    };
  };
  onSuccess: (data: {
    id: string;
    consumo_kwh: number;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    saldo_energia_kwh: number;
    observacao: string | null;
    data_vencimento: string;
    percentual_desconto: number;
  }) => void | Promise<void>;
}
