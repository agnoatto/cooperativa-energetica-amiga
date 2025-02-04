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
          documento: string | null
          email: string | null
          id: string
          nome: string | null
          responsavel_cpf: string | null
          responsavel_nome: string | null
          responsavel_telefone: string | null
          telefone: string | null
          tipo_pessoa: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: "fk_historico_cooperado"
            columns: ["titular_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_historico_investidor"
            columns: ["titular_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
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
          beneficiario_agencia: string | null
          beneficiario_banco: string | null
          beneficiario_conta: string | null
          beneficiario_documento: string | null
          beneficiario_email: string | null
          beneficiario_nome: string | null
          beneficiario_telefone: string | null
          created_at: string
          documento: string
          email: string | null
          id: string
          nome: string
          session_id: string | null
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          beneficiario_agencia?: string | null
          beneficiario_banco?: string | null
          beneficiario_conta?: string | null
          beneficiario_documento?: string | null
          beneficiario_email?: string | null
          beneficiario_nome?: string | null
          beneficiario_telefone?: string | null
          created_at?: string
          documento: string
          email?: string | null
          id?: string
          nome: string
          session_id?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          beneficiario_agencia?: string | null
          beneficiario_banco?: string | null
          beneficiario_conta?: string | null
          beneficiario_documento?: string | null
          beneficiario_email?: string | null
          beneficiario_nome?: string | null
          beneficiario_telefone?: string | null
          created_at?: string
          documento?: string
          email?: string | null
          id?: string
          nome?: string
          session_id?: string | null
          status?: string | null
          telefone?: string | null
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
        ]
      }
      unidades_beneficiarias: {
        Row: {
          apelido: string | null
          cooperado_id: string
          created_at: string
          data_entrada: string
          data_saida: string | null
          endereco: string
          id: string
          numero_uc: string
          percentual_desconto: number
          updated_at: string
        }
        Insert: {
          apelido?: string | null
          cooperado_id: string
          created_at?: string
          data_entrada: string
          data_saida?: string | null
          endereco: string
          id?: string
          numero_uc: string
          percentual_desconto: number
          updated_at?: string
        }
        Update: {
          apelido?: string | null
          cooperado_id?: string
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          endereco?: string
          id?: string
          numero_uc?: string
          percentual_desconto?: number
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
        ]
      }
      unidades_usina: {
        Row: {
          created_at: string
          endereco: string
          id: string
          numero_uc: string
          session_id: string | null
          status: string | null
          titular_id: string
          titular_tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          endereco: string
          id?: string
          numero_uc: string
          session_id?: string | null
          status?: string | null
          titular_id: string
          titular_tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          endereco?: string
          id?: string
          numero_uc?: string
          session_id?: string | null
          status?: string | null
          titular_id?: string
          titular_tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_titular_cooperado"
            columns: ["titular_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_titular_investidor"
            columns: ["titular_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
        ]
      }
      usinas: {
        Row: {
          created_at: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
