
export interface UsinaData {
  id: string;
  valor_kwh: number;
  status: string;
  potencia_instalada?: number;
  data_inicio?: string;
  
  // Dados do investidor
  investidor_id?: string;
  investidor?: {
    id?: string;
    nome_investidor: string;
    documento?: string;
    email?: string;
    telefone?: string;
  };
  
  // Dados da unidade
  unidade_usina_id?: string;
  unidade?: {
    id?: string;
    numero_uc: string;
    titular_nome?: string;
    titular_tipo?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
  
  // Dados de pagamento
  dados_pagamento_nome?: string;
  dados_pagamento_documento?: string;
  dados_pagamento_banco?: string;
  dados_pagamento_agencia?: string;
  dados_pagamento_conta?: string;
  dados_pagamento_telefone?: string;
  dados_pagamento_email?: string;
  dados_pagamento_chave_pix?: string;
  dados_pagamento_tipo_chave_pix?: string;
}
