
import type { UnidadeUsina } from "../types";

export const formatAddress = ({
  logradouro,
  numero,
  complemento,
  cidade,
  uf,
  cep,
}: Partial<UnidadeUsina>) => {
  const parts = [logradouro, numero, complemento, cidade, uf, cep].filter(Boolean);
  return parts.join(", ");
};
