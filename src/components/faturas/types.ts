
export interface FaturaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: {
    id: string;
    consumo_kwh: number;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    saldo_energia_kwh: number;
    observacao: string | null;
    unidade_beneficiaria: {
      percentual_desconto: number;
    };
  };
  onSuccess: () => void;
}

