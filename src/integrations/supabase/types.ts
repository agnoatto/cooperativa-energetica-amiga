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
      faturas: {
        Row: {
          ano: number
          arquivo_concessionaria_nome: string | null
          arquivo_concessionaria_path: string | null
          arquivo_concessionaria_tamanho: number | null
          arquivo_concessionaria_tipo: string | null
          consumo_kwh: number
          created_at: string
          data_confirmacao_pagamento: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_vencimento: string
          economia_acumulada: number | null
          economia_mes: number | null
          fatura_concessionaria: number
          historico_status: Json | null
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
          valor_desconto: number
          valor_total: number
        }
        Insert: {
          ano: number
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          consumo_kwh: number
          created_at?: string
          data_confirmacao_pagamento?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number
          historico_status?: Json | null
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
          valor_desconto?: number
          valor_total: number
        }
        Update: {
          ano?: number
          arquivo_concessionaria_nome?: string | null
          arquivo_concessionaria_path?: string | null
          arquivo_concessionaria_tamanho?: number | null
          arquivo_concessionaria_tipo?: string | null
          consumo_kwh?: number
          created_at?: string
          data_confirmacao_pagamento?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          fatura_concessionaria?: number
          historico_status?: Json | null
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
          valor_desconto?: number
          valor_total?: number
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
      historico_titulares_usina: {
        Row: {
          data_alteracao: string
          id: string
          titular_id: string
          titular_tipo: string
          unidade_usina_id: string
        }
        Insert: {
          data_alteracao?: string
          id?: string
          titular_id: string
          titular_tipo: string
          unidade_usina_id: string
        }
        Update: {
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
      pagamentos_usina: {
        Row: {
          ano: number
          conta_energia: number
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          economia_acumulada: number | null
          economia_mes: number | null
          geracao_kwh: number
          id: string
          mes: number
          status: string
          updated_at: string
          usina_id: string | null
          valor_total: number
          valor_tusd_fio_b: number
        }
        Insert: {
          ano: number
          conta_energia: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          geracao_kwh: number
          id?: string
          mes: number
          status?: string
          updated_at?: string
          usina_id?: string | null
          valor_total: number
          valor_tusd_fio_b: number
        }
        Update: {
          ano?: number
          conta_energia?: number
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          economia_acumulada?: number | null
          economia_mes?: number | null
          geracao_kwh?: number
          id?: string
          mes?: number
          status?: string
          updated_at?: string
          usina_id?: string | null
          valor_total?: number
          valor_tusd_fio_b?: number
        }
        Relationships: [
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
          created_at: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
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
      unidades_beneficiarias: {
        Row: {
          apelido: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cooperado_id: string
          created_at: string
          data_entrada: string
          data_saida: string | null
          endereco: string
          id: string
          logradouro: string | null
          numero: string | null
          numero_uc: string
          percentual_desconto: number
          uf: string | null
          updated_at: string
        }
        Insert: {
          apelido?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cooperado_id: string
          created_at?: string
          data_entrada: string
          data_saida?: string | null
          endereco: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc: string
          percentual_desconto: number
          uf?: string | null
          updated_at?: string
        }
        Update: {
          apelido?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cooperado_id?: string
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          endereco?: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          numero_uc?: string
          percentual_desconto?: number
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
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
      usinas: {
        Row: {
          created_at: string
          dados_pagamento_agencia: string | null
          dados_pagamento_banco: string | null
          dados_pagamento_conta: string | null
          dados_pagamento_documento: string | null
          dados_pagamento_email: string | null
          dados_pagamento_nome: string | null
          dados_pagamento_telefone: string | null
          deleted_at: string | null
          id: string
          investidor_id: string
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
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          deleted_at?: string | null
          id?: string
          investidor_id: string
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
          dados_pagamento_conta?: string | null
          dados_pagamento_documento?: string | null
          dados_pagamento_email?: string | null
          dados_pagamento_nome?: string | null
          dados_pagamento_telefone?: string | null
          deleted_at?: string | null
          id?: string
          investidor_id?: string
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
