
/**
 * Utilitários de formatação para a tabela de cooperados
 * 
 * Este arquivo contém funções utilitárias para formatação de dados
 * exibidos na tabela de cooperados, como documentos e informações de contato.
 */
import { formatarDocumento } from "@/utils/formatters";

// Formata os dados de contato do cooperado para exibição
export function formatarContato(telefone: string | null, email: string | null): string {
  if (!telefone && !email) return "-";
  
  return [
    telefone && `Tel: ${telefone}`,
    email && `Email: ${email}`,
  ]
    .filter(Boolean)
    .join(", ");
}

// Formata o documento do cooperado de acordo com o tipo de pessoa
export function formatarDocumentoCooperado(
  documento: string | null, 
  tipoPessoa: "PF" | "PJ"
): string {
  if (!documento) return "-";
  return formatarDocumento(documento, tipoPessoa);
}

// Formata a informação de unidades para exibição
export function formatarInfoUnidades(quantidadeUnidades: number): string {
  if (quantidadeUnidades === 0) return "Nenhuma unidade";
  return `${quantidadeUnidades} unidade(s)`;
}

