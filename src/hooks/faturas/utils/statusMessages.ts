
import { FaturaStatus } from "@/types/fatura";

export const statusMessages: Record<FaturaStatus, string> = {
  pendente: "Fatura criada com sucesso, aguardando preenchimento!",
  gerada: "Dados da fatura preenchidos com sucesso!",
  enviada: "Fatura enviada com sucesso!",
  corrigida: "Fatura marcada para correção!",
  reenviada: "Fatura reenviada com sucesso!",
  paga: "Pagamento confirmado com sucesso!",
  finalizada: "Fatura finalizada com sucesso!",
  atrasada: "Fatura marcada como atrasada!"
};
