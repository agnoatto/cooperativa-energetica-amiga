
export interface Empresa {
  id: string;
  nome: string;
  razao_social?: string;
  documento: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  tipo_empresa?: string;
  data_fundacao?: string;
  email?: string;
  telefone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmpresaFormData {
  nome: string;
  razao_social: string;
  documento: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  tipo_empresa: string;
  data_fundacao?: string;
  email?: string;
  telefone?: string;
}
