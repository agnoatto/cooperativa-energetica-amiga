export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backup_faturas: {
        Row: {
          ano: number | null
          arquivo_concessionaria_nome: string | null
          arquivo_concessionaria_path: string | null
          arquivo_concessionaria_tamanho: number | null
          arquivo_concessionaria_tipo: string | null
          boleto_codigo_barras: string | null
          boleto_id: string | null
          boleto_linha_digitavel: string | null
          boleto_pdf_path: string | null
          boleto_url: string | null
          consumo_kwh: number | null
          created_at: string | null
          data_atualizacao: string | null
          data_confirmacao_pagamento: string | null
          data_criacao: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          economia_acumulada: number | null
          economia_mes: number | null
          fatura_concessionaria: number | null
          historico_status: Json | null
          id: string | null
          iluminacao_publica: number | null
          mes: number | null
          observacao: string | null
          observacao_pagamento: string | null
          outros_valores: number | null
          saldo_energia_kwh: number | null
          send_method:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status: Database["public"]["Enums"]["fatura_status"] | null
          total_fatura: number | null
          unidade_beneficiaria_id: string | null
          updated_at: string | null
          valor_adicional: number | null
          valor_assinatura: number | null
          valor_desconto: number | null
        }
        Insert: {
          ano?: number | null
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          boleto_codigo_barras?: string | null
          boleto_id?: string | null
          boleto_linha_digitavel?: string | null
          boleto_pdf_path?: string | null
          boleto_url?: string | null
          consumo_kwh?: number | null
          created_at?: string | null
          data_atualizacao?: string | null
          data_confirmacao_pagamento?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number | null
          historico_status?: Json | null
          id?: string | null
          iluminacao_publica?: number | null
          mes?: number | null
          observacao?: string | null
          observacao_pagamento?: string | null
          outros_valores?: number | null
          saldo_energia_kwh?: number | null
          send_method?:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status?: Database["public"]["Enums"]["fatura_status"] | null
          total_fatura?: number | null
          unidade_beneficiaria_id?: string | null
          updated_at?: string | null
          valor_adicional?: number | null
          valor_assinatura?: number | null
          valor_desconto?: number | null
        }
        Update: {
          ano?: number | null
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          boleto_codigo_barras?: string | null
          boleto_id?: string | null
          boleto_linha_digitavel?: string | null
          boleto_pdf_path?: string | null
          boleto_url?: string | null
          consumo_kwh?: number | null
          created_at?: string | null
          data_atualizacao?: string | null
          data_confirmacao_pagamento?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number | null
          historico_status?: Json | null
          id?: string | null
          iluminacao_publica?: number | null
          mes?: number | null
          observacao?: string | null
          observacao_pagamento?: string | null
          outros_valores?: number | null
          saldo_energia_kwh?: number | null
          send_method?:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status?: Database["public"]["Enums"]["fatura_status"] | null
          total_fatura?: number | null
          unidade_beneficiaria_id?: string | null
          updated_at?: string | null
          valor_adicional?: number | null
          valor_assinatura?: number | null
          valor_desconto?: number | null
        }
        Relationships: []
      }
      backup_historico_faturas: {
        Row: {
          historico_status: Json | null
          id: string | null
          status: Database["public"]["Enums"]["fatura_status"] | null
        }
        Insert: {
          historico_status?: Json | null
          id?: string | null
          status?: Database["public"]["Enums"]["fatura_status"] | null
        }
        Update: {
          historico_status?: Json | null
          id?: string | null
          status?: Database["public"]["Enums"]["fatura_status"] | null
        }
        Relationships: []
      }
      calculo_fatura_templates: {
        Row: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id?: string
          is_padrao?: boolean
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          formula_valor_assinatura?: string
          formula_valor_desconto?: string
          id?: string
          is_padrao?: boolean
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          banco: string | null
          conta: string | null
          cor: string | null
          created_at: string
          data_saldo_inicial: string
          deleted_at: string | null
          descricao: string | null
          digito: string | null
          empresa_id: string
          id: string
          nome: string
          saldo_atual: number
          saldo_inicial: number
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          cor?: string | null
          created_at?: string
          data_saldo_inicial: string
          deleted_at?: string | null
          descricao?: string | null
          digito?: string | null
          empresa_id: string
          id?: string
          nome: string
          saldo_atual?: number
          saldo_inicial?: number
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          cor?: string | null
          created_at?: string
          data_saldo_inicial?: string
          deleted_at?: string | null
          descricao?: string | null
          digito?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          saldo_atual?: number
          saldo_inicial?: number
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      cooperados: {
        Row: {
          created_at: string
          data_exclusao: string | null
          documento: string | null
          email: string | null
          id: string
          nome: string | null
          numero_cadastro: string | null
          responsavel_cpf: string | null
          responsavel_nome: string | null
          responsavel_telefone: string | null
          telefone: string | null
          tipo_pessoa: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_exclusao?: string | null
          documento?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          numero_cadastro?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_exclusao?: string | null
          documento?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          numero_cadastro?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cooperativas: {
        Row: {
          configuracoes: Json | null
          created_at: string
          deleted_at: string | null
          documento: string
          email: string | null
          id: string
          nome: string
          telefone: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          configuracoes?: Json | null
          created_at?: string
          deleted_at?: string | null
          documento: string
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          configuracoes?: Json | null
          created_at?: string
          deleted_at?: string | null
          documento?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          created_at: string
          deleted_at: string | null
          documento: string
          email: string | null
          id: string
          nome: string
          razao_social: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          documento: string
          email?: string | null
          id?: string
          nome: string
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          documento?: string
          email?: string | null
          id?: string
          nome?: string
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faturas: {
        Row: {
          ano: number
          arquivo_concessionaria_nome: string | null
          arquivo_concessionaria_path: string | null
          arquivo_concessionaria_tamanho: number | null
          arquivo_concessionaria_tipo: string | null
          boleto_codigo_barras: string | null
          boleto_id: string | null
          boleto_linha_digitavel: string | null
          boleto_pdf_path: string | null
          boleto_url: string | null
          consumo_kwh: number
          created_at: string
          data_atualizacao: string | null
          data_confirmacao_pagamento: string | null
          data_criacao: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_proxima_leitura: string | null
          data_vencimento: string
          economia_acumulada: number | null
          economia_mes: number | null
          fatura_concessionaria: number
          id: string
          iluminacao_publica: number
          mes: number
          observacao: string | null
          observacao_pagamento: string | null
          outros_valores: number
          saldo_energia_kwh: number
          send_method:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status: Database["public"]["Enums"]["fatura_status"]
          total_fatura: number
          unidade_beneficiaria_id: string
          updated_at: string
          valor_adicional: number | null
          valor_assinatura: number | null
          valor_desconto: number
        }
        Insert: {
          ano: number
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          boleto_codigo_barras?: string | null
          boleto_id?: string | null
          boleto_linha_digitavel?: string | null
          boleto_pdf_path?: string | null
          boleto_url?: string | null
          consumo_kwh: number
          created_at?: string
          data_atualizacao?: string | null
          data_confirmacao_pagamento?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_proxima_leitura?: string | null
          data_vencimento: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number
          id?: string
          iluminacao_publica?: number
          mes: number
          observacao?: string | null
          observacao_pagamento?: string | null
          outros_valores?: number
          saldo_energia_kwh?: number
          send_method?:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status?: Database["public"]["Enums"]["fatura_status"]
          total_fatura?: number
          unidade_beneficiaria_id: string
          updated_at?: string
          valor_adicional?: number | null
          valor_assinatura?: number | null
          valor_desconto?: number
        }
        Update: {
          ano?: number
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          boleto_codigo_barras?: string | null
          boleto_id?: string | null
          boleto_linha_digitavel?: string | null
          boleto_pdf_path?: string | null
          boleto_url?: string | null
          consumo_kwh?: number
          created_at?: string
          data_atualizacao?: string | null
          data_confirmacao_pagamento?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_proxima_leitura?: string | null
          data_vencimento?: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number
          id?: string
          iluminacao_publica?: number
          mes?: number
          observacao?: string | null
          observacao_pagamento?: string | null
          outros_valores?: number
          saldo_energia_kwh?: number
          send_method?:
            | Database["public"]["Enums"]["communication_method"][]
            | null
          status?: Database["public"]["Enums"]["fatura_status"]
          total_fatura?: number
          unidade_beneficiaria_id?: string
          updated_at?: string
          valor_adicional?: number | null
          valor_assinatura?: number | null
          valor_desconto?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturas_unidade_beneficiaria_id_fkey"
            columns: ["unidade_beneficiaria_id"]
            isOneToOne: false
            referencedRelation: "unidades_beneficiarias"
            referencedColumns: ["id"]
          },
        ]
      }
      geracao_prevista: {
        Row: {
          ano: number
          created_at: string
          geracao_prevista: number
          id: string
          mes: number
          updated_at: string
          usina_id: string
        }
        Insert: {
          ano: number
          created_at?: string
          geracao_prevista: number
          id?: string
          mes: number
          updated_at?: string
          usina_id: string
        }
        Update: {
          ano?: number
          created_at?: string
          geracao_prevista?: number
          id?: string
          mes?: number
          updated_at?: string
          usina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "geracao_prevista_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geracao_prevista_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      geracao_prevista_usina: {
        Row: {
          abril: number | null
          agosto: number | null
          ano: number
          created_at: string
          dezembro: number | null
          fevereiro: number | null
          id: string
          janeiro: number | null
          julho: number | null
          junho: number | null
          maio: number | null
          marco: number | null
          novembro: number | null
          outubro: number | null
          setembro: number | null
          updated_at: string
          usina_id: string
        }
        Insert: {
          abril?: number | null
          agosto?: number | null
          ano: number
          created_at?: string
          dezembro?: number | null
          fevereiro?: number | null
          id?: string
          janeiro?: number | null
          julho?: number | null
          junho?: number | null
          maio?: number | null
          marco?: number | null
          novembro?: number | null
          outubro?: number | null
          setembro?: number | null
          updated_at?: string
          usina_id: string
        }
        Update: {
          abril?: number | null
          agosto?: number | null
          ano?: number
          created_at?: string
          dezembro?: number | null
          fevereiro?: number | null
          id?: string
          janeiro?: number | null
          julho?: number | null
          junho?: number | null
          maio?: number | null
          marco?: number | null
          novembro?: number | null
          outubro?: number | null
          setembro?: number | null
          updated_at?: string
          usina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "geracao_prevista_usina_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geracao_prevista_usina_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_titulares_usina: {
        Row: {
          apelido: string | null
          data_alteracao: string
          id: string
          titular_id: string
          titular_tipo: string
          unidade_usina_id: string
        }
        Insert: {
          apelido?: string | null
          data_alteracao?: string
          id?: string
          titular_id: string
          titular_tipo: string
          unidade_usina_id: string
        }
        Update: {
          apelido?: string | null
          data_alteracao?: string
          id?: string
          titular_id?: string
          titular_tipo?: string
          unidade_usina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_titulares_usina_unidade_usina_id_fkey"
            columns: ["unidade_usina_id"]
            isOneToOne: false
            referencedRelation: "unidades_usina"
            referencedColumns: ["id"]
          },
        ]
      }
      integracao_cora: {
        Row: {
          ambiente: Database["public"]["Enums"]["integracao_ambiente"]
          client_id: string
          client_secret: string
          configuracoes_boleto: Json
          created_at: string
          empresa_id: string
          id: string
          updated_at: string
        }
        Insert: {
          ambiente?: Database["public"]["Enums"]["integracao_ambiente"]
          client_id: string
          client_secret: string
          configuracoes_boleto?: Json
          created_at?: string
          empresa_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          ambiente?: Database["public"]["Enums"]["integracao_ambiente"]
          client_id?: string
          client_secret?: string
          configuracoes_boleto?: Json
          created_at?: string
          empresa_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integracao_cora_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      investidores: {
        Row: {
          created_at: string
          deleted_at: string | null
          documento: string
          email: string | null
          id: string
          nome_investidor: string
          session_id: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          documento: string
          email?: string | null
          id?: string
          nome_investidor: string
          session_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          documento?: string
          email?: string | null
          id?: string
          nome_investidor?: string
          session_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lancamentos_financeiros: {
        Row: {
          comprovante_nome: string | null
          comprovante_path: string | null
          comprovante_tipo: string | null
          conta_bancaria_id: string | null
          cooperado_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          deleted_at: string | null
          descricao: string
          fatura_id: string | null
          historico_status: Json | null
          id: string
          investidor_id: string | null
          observacao: string | null
          pagamento_usina_id: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["status_lancamento"]
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at: string
          valor: number
          valor_desconto: number | null
          valor_juros: number | null
          valor_original: number | null
          valor_pago: number | null
        }
        Insert: {
          comprovante_nome?: string | null
          comprovante_path?: string | null
          comprovante_tipo?: string | null
          conta_bancaria_id?: string | null
          cooperado_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          deleted_at?: string | null
          descricao: string
          fatura_id?: string | null
          historico_status?: Json | null
          id?: string
          investidor_id?: string | null
          observacao?: string | null
          pagamento_usina_id?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["status_lancamento"]
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          valor: number
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_original?: number | null
          valor_pago?: number | null
        }
        Update: {
          comprovante_nome?: string | null
          comprovante_path?: string | null
          comprovante_tipo?: string | null
          conta_bancaria_id?: string | null
          cooperado_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          deleted_at?: string | null
          descricao?: string
          fatura_id?: string | null
          historico_status?: Json | null
          id?: string
          investidor_id?: string | null
          observacao?: string | null
          pagamento_usina_id?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["status_lancamento"]
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          valor?: number
          valor_desconto?: number | null
          valor_juros?: number | null
          valor_original?: number | null
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lancamentos_cooperado"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lancamentos_cooperado"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lancamentos_fatura"
            columns: ["fatura_id"]
            isOneToOne: false
            referencedRelation: "faturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lancamentos_investidor"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lancamentos_pagamento_usina"
            columns: ["pagamento_usina_id"]
            isOneToOne: false
            referencedRelation: "pagamentos_usina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_fatura_id_fkey"
            columns: ["fatura_id"]
            isOneToOne: false
            referencedRelation: "faturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_investidor_id_fkey"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_pagamento_usina_id_fkey"
            columns: ["pagamento_usina_id"]
            isOneToOne: false
            referencedRelation: "pagamentos_usina"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos_usina: {
        Row: {
          ano: number
          arquivo_conta_energia_nome: string | null
          arquivo_conta_energia_path: string | null
          arquivo_conta_energia_tamanho: number | null
          arquivo_conta_energia_tipo: string | null
          cooperativa_id: string | null
          created_at: string
          data_confirmacao: string | null
          data_emissao: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_vencimento: string
          data_vencimento_concessionaria: string | null
          geracao_kwh: number
          historico_status: Json | null
          id: string
          mes: number
          observacao: string | null
          observacao_pagamento: string | null
          send_method: string[] | null
          status: Database["public"]["Enums"]["pagamento_status"] | null
          tusd_fio_b: number | null
          updated_at: string
          usina_id: string | null
          valor_concessionaria: number
          valor_total: number
          valor_tusd_fio_b: number
        }
        Insert: {
          ano: number
          arquivo_conta_energia_nome?: string | null
          arquivo_conta_energia_path?: string | null
          arquivo_conta_energia_tamanho?: number | null
          arquivo_conta_energia_tipo?: string | null
          cooperativa_id?: string | null
          created_at?: string
          data_confirmacao?: string | null
          data_emissao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          data_vencimento_concessionaria?: string | null
          geracao_kwh: number
          historico_status?: Json | null
          id?: string
          mes: number
          observacao?: string | null
          observacao_pagamento?: string | null
          send_method?: string[] | null
          status?: Database["public"]["Enums"]["pagamento_status"] | null
          tusd_fio_b?: number | null
          updated_at?: string
          usina_id?: string | null
          valor_concessionaria?: number
          valor_total: number
          valor_tusd_fio_b: number
        }
        Update: {
          ano?: number
          arquivo_conta_energia_nome?: string | null
          arquivo_conta_energia_path?: string | null
          arquivo_conta_energia_tamanho?: number | null
          arquivo_conta_energia_tipo?: string | null
          cooperativa_id?: string | null
          created_at?: string
          data_confirmacao?: string | null
          data_emissao?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          data_vencimento_concessionaria?: string | null
          geracao_kwh?: number
          historico_status?: Json | null
          id?: string
          mes?: number
          observacao?: string | null
          observacao_pagamento?: string | null
          send_method?: string[] | null
          status?: Database["public"]["Enums"]["pagamento_status"] | null
          tusd_fio_b?: number | null
          updated_at?: string
          usina_id?: string | null
          valor_concessionaria?: number
          valor_total?: number
          valor_tusd_fio_b?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_usina_cooperativa_id_fkey"
            columns: ["cooperativa_id"]
            isOneToOne: false
            referencedRelation: "cooperativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usina_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usina_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_template_fields: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          font_family: string | null
          font_size: number | null
          height: number
          id: string
          template_id: string
          updated_at: string
          width: number
          x_position: number
          y_position: number
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_type: string
          font_family?: string | null
          font_size?: number | null
          height: number
          id?: string
          template_id: string
          updated_at?: string
          width: number
          x_position: number
          y_position: number
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          font_family?: string | null
          font_size?: number | null
          height?: number
          id?: string
          template_id?: string
          updated_at?: string
          width?: number
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "pdf_template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "pdf_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          template_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_storage_path: string | null
          avatar_url: string | null
          cargo: string | null
          cooperativa_id: string | null
          created_at: string
          email: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_storage_path?: string | null
          avatar_url?: string | null
          cargo?: string | null
          cooperativa_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_storage_path?: string | null
          avatar_url?: string | null
          cargo?: string | null
          cooperativa_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cooperativa_id_fkey"
            columns: ["cooperativa_id"]
            isOneToOne: false
            referencedRelation: "cooperativas"
            referencedColumns: ["id"]
          },
        ]
      }
      rateios: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          percentual: number
          unidade_beneficiaria_id: string
          updated_at: string
          usina_id: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          id?: string
          percentual: number
          unidade_beneficiaria_id: string
          updated_at?: string
          usina_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          percentual?: number
          unidade_beneficiaria_id?: string
          updated_at?: string
          usina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rateios_unidade_beneficiaria_id_fkey"
            columns: ["unidade_beneficiaria_id"]
            isOneToOne: false
            referencedRelation: "unidades_beneficiarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rateios_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rateios_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      saldos_diarios: {
        Row: {
          conta_bancaria_id: string
          created_at: string
          data: string
          empresa_id: string
          entradas: number
          id: string
          saidas: number
          saldo_final: number
          saldo_inicial: number
          updated_at: string
        }
        Insert: {
          conta_bancaria_id: string
          created_at?: string
          data: string
          empresa_id: string
          entradas?: number
          id?: string
          saidas?: number
          saldo_final: number
          saldo_inicial: number
          updated_at?: string
        }
        Update: {
          conta_bancaria_id?: string
          created_at?: string
          data?: string
          empresa_id?: string
          entradas?: number
          id?: string
          saidas?: number
          saldo_final?: number
          saldo_inicial?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saldos_diarios_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias_bancarias: {
        Row: {
          comprovante_nome: string | null
          comprovante_path: string | null
          comprovante_tamanho: number | null
          comprovante_tipo: string | null
          conta_destino_id: string | null
          conta_origem_id: string | null
          created_at: string
          data_conciliacao: string | null
          data_transferencia: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          historico_status: Json | null
          id: string
          observacao: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          comprovante_nome?: string | null
          comprovante_path?: string | null
          comprovante_tamanho?: number | null
          comprovante_tipo?: string | null
          conta_destino_id?: string | null
          conta_origem_id?: string | null
          created_at?: string
          data_conciliacao?: string | null
          data_transferencia?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          historico_status?: Json | null
          id?: string
          observacao?: string | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          comprovante_nome?: string | null
          comprovante_path?: string | null
          comprovante_tamanho?: number | null
          comprovante_tipo?: string | null
          conta_destino_id?: string | null
          conta_origem_id?: string | null
          created_at?: string
          data_conciliacao?: string | null
          data_transferencia?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          historico_status?: Json | null
          id?: string
          observacao?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_bancarias_conta_destino_id_fkey"
            columns: ["conta_destino_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_bancarias_conta_origem_id_fkey"
            columns: ["conta_origem_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_beneficiarias: {
        Row: {
          apelido: string | null
          bairro: string | null
          calculo_fatura_template_id: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          consumo_kwh: number | null
          cooperado_id: string
          created_at: string
          data_entrada: string
          data_inicio_creditos: string | null
          data_inicio_geracao: string | null
          data_saida: string | null
          endereco: string
          id: string
          logradouro: string | null
          numero: string | null
          numero_uc: string
          observacao_creditos: string | null
          observacao_geracao: string | null
          percentual_desconto: number
          possui_geracao_propria: boolean | null
          potencia_instalada: number | null
          recebe_creditos_proprios: boolean | null
          uc_origem_creditos: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          apelido?: string | null
          bairro?: string | null
          calculo_fatura_template_id?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          consumo_kwh?: number | null
          cooperado_id: string
          created_at?: string
          data_entrada: string
          data_inicio_creditos?: string | null
          data_inicio_geracao?: string | null
          data_saida?: string | null
          endereco: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc: string
          observacao_creditos?: string | null
          observacao_geracao?: string | null
          percentual_desconto: number
          possui_geracao_propria?: boolean | null
          potencia_instalada?: number | null
          recebe_creditos_proprios?: boolean | null
          uc_origem_creditos?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          apelido?: string | null
          bairro?: string | null
          calculo_fatura_template_id?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          consumo_kwh?: number | null
          cooperado_id?: string
          created_at?: string
          data_entrada?: string
          data_inicio_creditos?: string | null
          data_inicio_geracao?: string | null
          data_saida?: string | null
          endereco?: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc?: string
          observacao_creditos?: string | null
          observacao_geracao?: string | null
          percentual_desconto?: number
          possui_geracao_propria?: boolean | null
          potencia_instalada?: number | null
          recebe_creditos_proprios?: boolean | null
          uc_origem_creditos?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_beneficiarias_calculo_fatura_template_id_fkey"
            columns: ["calculo_fatura_template_id"]
            isOneToOne: false
            referencedRelation: "calculo_fatura_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unidades_beneficiarias_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unidades_beneficiarias_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados_ativos"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_usina: {
        Row: {
          apelido: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          id: string
          logradouro: string | null
          numero: string | null
          numero_uc: string
          session_id: string | null
          titular_id: string
          titular_tipo: string
          uf: string | null
          updated_at: string
        }
        Insert: {
          apelido?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc: string
          session_id?: string | null
          titular_id: string
          titular_tipo?: string
          uf?: string | null
          updated_at?: string
        }
        Update: {
          apelido?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc?: string
          session_id?: string | null
          titular_id?: string
          titular_tipo?: string
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          cooperativa_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          cooperativa_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          cooperativa_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_cooperativa_id_fkey"
            columns: ["cooperativa_id"]
            isOneToOne: false
            referencedRelation: "cooperativas"
            referencedColumns: ["id"]
          },
        ]
      }
      usinas: {
        Row: {
          created_at: string
          dados_pagamento_agencia: string | null
          dados_pagamento_banco: string | null
          dados_pagamento_chave_pix: string | null
          dados_pagamento_conta: string | null
          dados_pagamento_documento: string | null
          dados_pagamento_email: string | null
          dados_pagamento_nome: string | null
          dados_pagamento_telefone: string | null
          dados_pagamento_tipo_chave_pix: string | null
          data_inicio: string | null
          deleted_at: string | null
          id: string
          investidor_id: string
          potencia_instalada: number | null
          session_id: string | null
          status: string | null
          unidade_usina_id: string
          updated_at: string
          valor_kwh: number
        }
        Insert: {
          created_at?: string
          dados_pagamento_agencia?: string | null
          dados_pagamento_banco?: string | null
          dados_pagamento_chave_pix?: string | null
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          dados_pagamento_tipo_chave_pix?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          id?: string
          investidor_id: string
          potencia_instalada?: number | null
          session_id?: string | null
          status?: string | null
          unidade_usina_id: string
          updated_at?: string
          valor_kwh: number
        }
        Update: {
          created_at?: string
          dados_pagamento_agencia?: string | null
          dados_pagamento_banco?: string | null
          dados_pagamento_chave_pix?: string | null
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          dados_pagamento_tipo_chave_pix?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          id?: string
          investidor_id?: string
          potencia_instalada?: number | null
          session_id?: string | null
          status?: string | null
          unidade_usina_id?: string
          updated_at?: string
          valor_kwh?: number
        }
        Relationships: [
          {
            foreignKeyName: "usinas_investidor_id_fkey"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usinas_unidade_usina_id_fkey"
            columns: ["unidade_usina_id"]
            isOneToOne: false
            referencedRelation: "unidades_usina"
            referencedColumns: ["id"]
          },
        ]
      }
      usinas_audit: {
        Row: {
          changed_at: string | null
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          operation: string
          usina_id: string | null
        }
        Insert: {
          changed_at?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          operation: string
          usina_id?: string | null
        }
        Update: {
          changed_at?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          operation?: string
          usina_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usinas_audit_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usinas_audit_usina_id_fkey"
            columns: ["usina_id"]
            isOneToOne: false
            referencedRelation: "usinas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cooperados_ativos: {
        Row: {
          created_at: string | null
          data_exclusao: string | null
          documento: string | null
          email: string | null
          id: string | null
          nome: string | null
          numero_cadastro: string | null
          responsavel_cpf: string | null
          responsavel_nome: string | null
          responsavel_telefone: string | null
          telefone: string | null
          tipo_pessoa: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_exclusao?: string | null
          documento?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          numero_cadastro?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_exclusao?: string | null
          documento?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          numero_cadastro?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      metricas_financeiras: {
        Row: {
          mes: string | null
          quantidade: number | null
          status: Database["public"]["Enums"]["status_lancamento"] | null
          tipo: Database["public"]["Enums"]["tipo_lancamento"] | null
          valor_total: number | null
        }
        Relationships: []
      }
      usinas_ativas: {
        Row: {
          created_at: string | null
          dados_pagamento_agencia: string | null
          dados_pagamento_banco: string | null
          dados_pagamento_conta: string | null
          dados_pagamento_documento: string | null
          dados_pagamento_email: string | null
          dados_pagamento_nome: string | null
          dados_pagamento_telefone: string | null
          deleted_at: string | null
          id: string | null
          investidor_id: string | null
          session_id: string | null
          status: string | null
          unidade_usina_id: string | null
          updated_at: string | null
          valor_kwh: number | null
        }
        Insert: {
          created_at?: string | null
          dados_pagamento_agencia?: string | null
          dados_pagamento_banco?: string | null
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          deleted_at?: string | null
          id?: string | null
          investidor_id?: string | null
          session_id?: string | null
          status?: string | null
          unidade_usina_id?: string | null
          updated_at?: string | null
          valor_kwh?: number | null
        }
        Update: {
          created_at?: string | null
          dados_pagamento_agencia?: string | null
          dados_pagamento_banco?: string | null
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          deleted_at?: string | null
          id?: string | null
          investidor_id?: string | null
          session_id?: string | null
          status?: string | null
          unidade_usina_id?: string | null
          updated_at?: string | null
          valor_kwh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usinas_investidor_id_fkey"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usinas_unidade_usina_id_fkey"
            columns: ["unidade_usina_id"]
            isOneToOne: false
            referencedRelation: "unidades_usina"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      atualizar_pagamento_usina:
        | {
            Args: {
              p_id: string
              p_geracao_kwh: number
              p_tusd_fio_b: number
              p_valor_tusd_fio_b: number
              p_valor_concessionaria: number
              p_valor_total: number
              p_data_vencimento_concessionaria: string
              p_data_emissao: string
              p_data_vencimento: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_id: string
              p_geracao_kwh: number
              p_tusd_fio_b: number
              p_valor_tusd_fio_b: number
              p_valor_concessionaria: number
              p_valor_total: number
              p_data_vencimento_concessionaria: string
              p_data_emissao: string
              p_data_vencimento: string
              p_arquivo_conta_energia_nome?: string
              p_arquivo_conta_energia_path?: string
              p_arquivo_conta_energia_tipo?: string
              p_arquivo_conta_energia_tamanho?: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_id: string
              p_geracao_kwh: number
              p_tusd_fio_b: number
              p_valor_tusd_fio_b: number
              p_valor_concessionaria: number
              p_valor_total: number
              p_data_vencimento_concessionaria: string
              p_data_emissao: string
              p_data_vencimento: string
              p_arquivo_conta_energia_nome?: string
              p_arquivo_conta_energia_path?: string
              p_arquivo_conta_energia_tipo?: string
              p_arquivo_conta_energia_tamanho?: number
              p_observacao?: string
            }
            Returns: Json
          }
      avaliar_formula_calculo_fatura: {
        Args: {
          p_formula: string
          p_fatura_id: string
        }
        Returns: number
      }
      check_template_in_use: {
        Args: {
          template_id: string
        }
        Returns: boolean
      }
      create_calculo_fatura_template: {
        Args: {
          nome_template: string
          descricao_template: string
          formula_desconto: string
          formula_assinatura: string
          padrao: boolean
        }
        Returns: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }
      }
      criarnovafatura: {
        Args: {
          unidade_beneficiaria_id: string
          mes: number
          ano: number
          data_vencimento: string
        }
        Returns: Json
      }
      deletar_fatura: {
        Args: {
          p_fatura_id: string
        }
        Returns: undefined
      }
      deletar_pagamento: {
        Args: {
          pagamento_id: string
        }
        Returns: undefined
      }
      delete_calculo_fatura_template: {
        Args: {
          template_id: string
        }
        Returns: boolean
      }
      enriquecerdadosfatura: {
        Args: {
          lancamento_id: string
          fatura_id: string
        }
        Returns: boolean
      }
      executar_sincronizacao_lancamentos: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      gerar_saldo_diario_conta: {
        Args: {
          p_conta_id: string
          p_data: string
        }
        Returns: string
      }
      get_all_calculo_fatura_templates: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }[]
      }
      get_calculo_fatura_template: {
        Args: {
          template_id: string
        }
        Returns: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }[]
      }
      get_default_calculo_fatura_template: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }[]
      }
      get_lancamentos_by_tipo: {
        Args: {
          p_tipo: string
        }
        Returns: {
          comprovante_nome: string | null
          comprovante_path: string | null
          comprovante_tipo: string | null
          conta_bancaria_id: string | null
          cooperado_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          deleted_at: string | null
          descricao: string
          fatura_id: string | null
          historico_status: Json | null
          id: string
          investidor_id: string | null
          observacao: string | null
          pagamento_usina_id: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["status_lancamento"]
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at: string
          valor: number
          valor_desconto: number | null
          valor_juros: number | null
          valor_original: number | null
          valor_pago: number | null
        }[]
      }
      get_unidade_beneficiaria_template: {
        Args: {
          unidade_id: string
        }
        Returns: {
          calculo_fatura_template_id: string
        }[]
      }
      get_unidades_dashboard_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_cooperados: number
          total_consumo: number
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      inserir_lancamentos_existentes: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      registrar_pagamento_lancamento: {
        Args: {
          p_lancamento_id: string
          p_valor_pago: number
          p_valor_juros?: number
          p_valor_desconto?: number
          p_data_pagamento?: string
          p_observacao?: string
        }
        Returns: Json
      }
      reset_default_templates: {
        Args: {
          except_id: string
        }
        Returns: undefined
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      sincronizar_lancamentos_faturas: {
        Args: Record<PropertyKey, never>
        Returns: {
          faturas_sincronizadas: number
          detalhes: string[]
        }[]
      }
      sincronizar_lancamentos_faturas_existentes: {
        Args: Record<PropertyKey, never>
        Returns: {
          faturas_sincronizadas: number
          detalhes: string[]
        }[]
      }
      update_calculo_fatura_template: {
        Args: {
          template_id: string
          nome_template: string
          descricao_template: string
          formula_desconto: string
          formula_assinatura: string
          padrao: boolean
        }
        Returns: {
          created_at: string
          descricao: string | null
          formula_valor_assinatura: string
          formula_valor_desconto: string
          id: string
          is_padrao: boolean
          nome: string
          updated_at: string
        }
      }
      update_fatura:
        | {
            Args: {
              p_id: string
              p_consumo_kwh?: number
              p_valor_assinatura?: number
              p_data_vencimento?: string
              p_fatura_concessionaria?: number
              p_total_fatura?: number
              p_iluminacao_publica?: number
              p_outros_valores?: number
              p_valor_desconto?: number
              p_economia_acumulada?: number
              p_saldo_energia_kwh?: number
              p_observacao?: string
            }
            Returns: {
              ano: number
              arquivo_concessionaria_nome: string | null
              arquivo_concessionaria_path: string | null
              arquivo_concessionaria_tamanho: number | null
              arquivo_concessionaria_tipo: string | null
              boleto_codigo_barras: string | null
              boleto_id: string | null
              boleto_linha_digitavel: string | null
              boleto_pdf_path: string | null
              boleto_url: string | null
              consumo_kwh: number
              created_at: string
              data_atualizacao: string | null
              data_confirmacao_pagamento: string | null
              data_criacao: string | null
              data_envio: string | null
              data_pagamento: string | null
              data_proxima_leitura: string | null
              data_vencimento: string
              economia_acumulada: number | null
              economia_mes: number | null
              fatura_concessionaria: number
              id: string
              iluminacao_publica: number
              mes: number
              observacao: string | null
              observacao_pagamento: string | null
              outros_valores: number
              saldo_energia_kwh: number
              send_method:
                | Database["public"]["Enums"]["communication_method"][]
                | null
              status: Database["public"]["Enums"]["fatura_status"]
              total_fatura: number
              unidade_beneficiaria_id: string
              updated_at: string
              valor_adicional: number | null
              valor_assinatura: number | null
              valor_desconto: number
            }
          }
        | {
            Args: {
              p_id: string
              p_consumo_kwh?: number
              p_valor_assinatura?: number
              p_data_vencimento?: string
              p_fatura_concessionaria?: number
              p_total_fatura?: number
              p_iluminacao_publica?: number
              p_outros_valores?: number
              p_valor_desconto?: number
              p_economia_acumulada?: number
              p_saldo_energia_kwh?: number
              p_observacao?: string
              p_data_proxima_leitura?: string
            }
            Returns: {
              ano: number
              arquivo_concessionaria_nome: string | null
              arquivo_concessionaria_path: string | null
              arquivo_concessionaria_tamanho: number | null
              arquivo_concessionaria_tipo: string | null
              boleto_codigo_barras: string | null
              boleto_id: string | null
              boleto_linha_digitavel: string | null
              boleto_pdf_path: string | null
              boleto_url: string | null
              consumo_kwh: number
              created_at: string
              data_atualizacao: string | null
              data_confirmacao_pagamento: string | null
              data_criacao: string | null
              data_envio: string | null
              data_pagamento: string | null
              data_proxima_leitura: string | null
              data_vencimento: string
              economia_acumulada: number | null
              economia_mes: number | null
              fatura_concessionaria: number
              id: string
              iluminacao_publica: number
              mes: number
              observacao: string | null
              observacao_pagamento: string | null
              outros_valores: number
              saldo_energia_kwh: number
              send_method:
                | Database["public"]["Enums"]["communication_method"][]
                | null
              status: Database["public"]["Enums"]["fatura_status"]
              total_fatura: number
              unidade_beneficiaria_id: string
              updated_at: string
              valor_adicional: number | null
              valor_assinatura: number | null
              valor_desconto: number
            }
          }
      update_pagamento_status: {
        Args: {
          p_pagamento_id: string
          p_novo_status: Database["public"]["Enums"]["pagamento_status"]
          p_method?: string
        }
        Returns: {
          ano: number
          arquivo_conta_energia_nome: string | null
          arquivo_conta_energia_path: string | null
          arquivo_conta_energia_tamanho: number | null
          arquivo_conta_energia_tipo: string | null
          cooperativa_id: string | null
          created_at: string
          data_confirmacao: string | null
          data_emissao: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_vencimento: string
          data_vencimento_concessionaria: string | null
          geracao_kwh: number
          historico_status: Json | null
          id: string
          mes: number
          observacao: string | null
          observacao_pagamento: string | null
          send_method: string[] | null
          status: Database["public"]["Enums"]["pagamento_status"] | null
          tusd_fio_b: number | null
          updated_at: string
          usina_id: string | null
          valor_concessionaria: number
          valor_total: number
          valor_tusd_fio_b: number
        }
      }
      validate_pagamento_status_transition: {
        Args: {
          old_status: Database["public"]["Enums"]["pagamento_status"]
          new_status: Database["public"]["Enums"]["pagamento_status"]
        }
        Returns: boolean
      }
    }
    Enums: {
      communication_method: "email" | "whatsapp"
      fatura_status:
        | "gerada"
        | "pendente"
        | "enviada"
        | "atrasada"
        | "paga"
        | "finalizada"
        | "corrigida"
        | "reenviada"
      integracao_ambiente: "sandbox" | "production"
      pagamento_status:
        | "pendente"
        | "enviado"
        | "pago"
        | "atrasado"
        | "cancelado"
      status_lancamento: "pendente" | "pago" | "atrasado" | "cancelado"
      tipo_lancamento: "receita" | "despesa"
      user_role: "master" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
