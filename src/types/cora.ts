
export type CoraEnvironment = 'sandbox' | 'production';

export interface CoraConfig {
  client_id: string;
  client_secret: string;
  ambiente: CoraEnvironment;
  configuracoes_boleto: {
    instrucoes: string[];
    multa: {
      percentual: number;
      valor: number;
    };
    juros: {
      percentual: number;
      valor: number;
    };
    desconto: {
      percentual: number;
      valor: number;
      data_limite: string | null;
    };
  };
}

export interface CoraAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CoraError {
  error: string;
  error_description?: string;
  message?: string;
}
