
import { FaturaStatus } from "@/types/fatura";

export const statusMessages: Record<FaturaStatus, string> = {
  enviada: "Fatura enviada com sucesso!",
  corrigida: "Fatura marcada para correção!",
  reenviada: "Fatura reenviada com sucesso!",
  paga: "Pagamento confirmado com sucesso!",
  finalizada: "Fatura finalizada com sucesso!",
  atrasada: "Fatura marcada como atrasada!",
  pendente: "Fatura marcada como pendente!"
};
