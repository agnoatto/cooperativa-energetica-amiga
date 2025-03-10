
import { parseISO, isAfter, isBefore, isEqual } from "date-fns";
import { UnidadeBeneficiaria } from "../types";
import { NovaFatura } from "../types/gerarFaturas";

export const validarMesFuturo = (currentDate: Date, hoje: Date = new Date()) => {
  if (isAfter(currentDate, hoje)) {
    throw new Error("Não é possível gerar faturas para meses futuros");
  }
};

export const filtrarUnidadesElegiveis = (unidades: UnidadeBeneficiaria[], mes: number, ano: number) => {
  return unidades.filter(unidade => {
    const dataEntrada = parseISO(unidade.data_entrada);
    const dataFatura = new Date(ano, mes - 1, 1);
    
    // A unidade é elegível se:
    // 1. A data da fatura é depois da data de entrada OU
    // 2. A data da fatura é no mesmo mês/ano da data de entrada
    return (
      isAfter(dataFatura, dataEntrada) || 
      (dataFatura.getMonth() === dataEntrada.getMonth() && 
       dataFatura.getFullYear() === dataEntrada.getFullYear())
    );
  });
};

export const criarNovaFatura = (
  unidade_beneficiaria_id: string,
  mes: number,
  ano: number,
  data_vencimento: string
): NovaFatura => {
  return {
    unidade_beneficiaria_id,
    mes,
    ano,
    consumo_kwh: 0,
    total_fatura: 0,
    status: "pendente", // Alterado: agora começa como pendente em vez de gerada
    data_vencimento,
    economia_acumulada: 0,
    economia_mes: 0,
    saldo_energia_kwh: 0,
    fatura_concessionaria: 0,
    iluminacao_publica: 0,
    outros_valores: 0,
    valor_desconto: 0,
    valor_assinatura: 0,
    historico_status: [{
      status: "pendente",
      data: new Date().toISOString(),
      observacao: "Fatura criada, aguardando preenchimento"
    }],
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  };
};
