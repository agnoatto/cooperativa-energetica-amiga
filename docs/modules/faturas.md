
# Módulo de Faturas

## Visão Geral

O módulo de faturas é responsável pelo gerenciamento completo do ciclo de faturamento dos cooperados, desde a geração automática até o controle de pagamentos e aplicação de descontos.

## Estrutura de Dados

### Entidade Principal: Fatura

```typescript
interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_assinatura: number;
  status: FaturaStatus;
  data_vencimento: string;
  mes: number;
  ano: number;
  fatura_concessionaria: number;
  total_fatura: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  economia_acumulada: number;
  saldo_energia_kwh: number;
  observacao: string | null;
  valor_adicional: number;
  observacao_pagamento: string | null;
  data_pagamento: string | null;
  arquivo_concessionaria_path: string | null;
  arquivo_concessionaria_nome: string | null;
  arquivo_concessionaria_tipo: string | null;
  arquivo_concessionaria_tamanho: number | null;
  data_envio?: string | null;
  data_confirmacao_pagamento?: string | null;
  data_criacao?: string;
  data_atualizacao?: string;
  unidade_beneficiaria: UnidadeBeneficiaria;
}
```

### Estados possíveis da fatura:

```typescript
type FaturaStatus = 'gerada' | 'pendente' | 'enviada' | 'corrigida' | 'reenviada' | 'atrasada' | 'paga' | 'finalizada';
```

## Fluxo de Operações

### 1. Geração de Faturas

A geração de faturas é feita automaticamente pelo sistema em base mensal ou manualmente pelo usuário administrador:

1. **Verificação de Elegibilidade**: O sistema verifica quais unidades beneficiárias estão ativas no mês de referência
2. **Criação das Faturas**: Utilizando o hook `useGerarFaturas`, o sistema cria faturas vazias com status "gerada"
3. **Preenchimento Manual**: O usuário preenche os dados de consumo e valores para cada fatura

```typescript
// Função principal de geração de faturas
async function gerarFaturasMes(mes: number, ano: number): Promise<void> {
  // Valida que não é possível gerar faturas para meses futuros
  validarMesFuturo(new Date(ano, mes - 1, 1));
  
  // Busca unidades beneficiárias elegíveis
  const unidades = await fetchUnidadesBeneficiarias();
  const unidadesElegiveis = filtrarUnidadesElegiveis(unidades, mes, ano);
  
  // Verifica se existem faturas para o mês/ano
  const faturasExistentes = await verificarFaturasExistentes(mes, ano);
  
  // Cria novas faturas para unidades sem fatura no mês
  for (const unidade of unidadesElegiveis) {
    if (!faturasExistentes.some(f => f.unidade_beneficiaria_id === unidade.id)) {
      await criarFatura(unidade.id, mes, ano);
    }
  }
}
```

### 2. Edição de Faturas

A edição de faturas permite ao usuário atualizar os seguintes dados:

1. **Dados de Consumo**: kWh consumidos, valores da fatura da concessionária
2. **Valores Adicionais**: Iluminação pública, outros valores
3. **Datas**: Data de vencimento
4. **Arquivos**: Upload do arquivo da concessionária

O processo de edição utiliza o hook `useUpdateFatura` que realiza as seguintes operações:

```typescript
// Função de atualização de faturas
async function atualizarFatura(fatura: UpdateFaturaInput): Promise<Fatura> {
  // Calcular valores finais
  const percentualDesconto = fatura.percentual_desconto / 100;
  const baseDesconto = Number(fatura.total_fatura) - Number(fatura.iluminacao_publica) - Number(fatura.outros_valores);
  const valorDesconto = parseFloat((baseDesconto * percentualDesconto).toFixed(2));
  const valorAssinatura = parseFloat((Number(fatura.total_fatura) - valorDesconto - Number(fatura.fatura_concessionaria)).toFixed(2));
  
  // Preparar dados para atualização
  const dadosAtualizados = {
    // ... dados da fatura com valores calculados
  };
  
  // Atualizar no banco de dados
  const faturaAtualizada = await atualizarFaturaBanco(fatura.id, dadosAtualizados);
  
  return faturaAtualizada;
}
```

### 3. Processamento de Valores

O módulo utiliza funções específicas para processar valores monetários:

```typescript
// Função para converter string formatada em número
export const parseValue = (value: string): number => {
  if (!value) return 0;
  
  try {
    // Remove separadores de milhar e converte vírgula decimal para ponto
    const cleanValue = value.replace(/\./g, '').trim();
    const numeroFinal = cleanValue.replace(',', '.');
    
    return parseFloat(parseFloat(numeroFinal).toFixed(2));
  } catch (error) {
    console.error('Erro ao converter valor:', value, error);
    return 0;
  }
};

// Função para calcular valores derivados
export const calculateValues = (
  totalFatura: string,
  iluminacaoPublica: string, 
  outrosValores: string,
  faturaConcessionaria: string,
  percentualDesconto: number
) => {
  // Converter strings para números
  const total = parseValue(totalFatura);
  const iluminacao = parseValue(iluminacaoPublica);
  const outros = parseValue(outrosValores);
  const concessionaria = parseValue(faturaConcessionaria);
  
  // Calcular desconto e valor de assinatura
  const percentual = percentualDesconto / 100;
  const baseDesconto = total - iluminacao - outros;
  const valorDesconto = parseFloat((baseDesconto * percentual).toFixed(2));
  const valorAssinatura = parseFloat((total - valorDesconto - concessionaria).toFixed(2));
  
  return { valor_desconto: valorDesconto, valor_assinatura: valorAssinatura };
};
```

### 4. Fluxo de Status

O ciclo de vida de uma fatura segue um fluxo de status predefinido:

1. **gerada** → Fatura criada inicialmente
2. **pendente** → Fatura preenchida aguardando envio
3. **enviada** → Fatura enviada ao cooperado
4. **corrigida** → Fatura corrigida após envio
5. **reenviada** → Fatura corrigida e enviada novamente
6. **atrasada** → Fatura não paga até a data de vencimento
7. **paga** → Fatura com pagamento confirmado
8. **finalizada** → Fatura processada completamente

Cada mudança de status é registrada em um histórico com timestamp.

## Componentes Principais

### 1. FaturasContainer

Componente principal que gerencia a exibição e interação com faturas:

```typescript
// Funções principais do FaturasContainer:
// - Filtrar faturas por status e busca
// - Iniciar processo de geração de faturas
// - Gerenciar abertura/fechamento de modais
// - Coordenar atualização de faturas
```

### 2. FaturaEditModal

Modal para edição de faturas com os seguintes recursos:

```typescript
// Funções principais do FaturaEditModal:
// - Editar dados da fatura (consumo, valores, datas)
// - Upload de arquivo da concessionária
// - Validação de dados
// - Cálculo automático de valores derivados
```

### 3. CurrencyInput

Componente customizado para entrada de valores monetários:

```typescript
// Funções principais do CurrencyInput:
// - Formatar valores monetários conforme padrão brasileiro
// - Permitir digitação com separadores de milhares
// - Converter entre valores formatados e numéricos
```

## Hooks e Funções Utilitárias

### 1. useUpdateFatura

Hook para atualizar faturas no banco de dados:

```typescript
// Funções principais do useUpdateFatura:
// - Calcular valores derivados
// - Atualizar fatura no banco de dados
// - Notificar sucesso/erro
// - Invalidar cache de faturas
```

### 2. useFaturaEditForm

Hook para gerenciar o formulário de edição de faturas:

```typescript
// Funções principais do useFaturaEditForm:
// - Gerenciar estado do formulário
// - Validar campos
// - Preparar dados para atualização
// - Controlar estado de carregamento
```

### 3. Funções de Formatação de Data

```typescript
// Converter data UTC para local
export const convertUTCToLocal = (utcDate: string | null) => {
  if (!utcDate) return '';
  
  try {
    const date = toZonedTime(new Date(utcDate + 'T12:00:00'), TIMEZONE_BR);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Erro ao converter data para local:', error);
    return '';
  }
};

// Converter data local para UTC
export const convertLocalToUTC = (localDate: string) => {
  if (!localDate) return null;
  
  try {
    const date = toZonedTime(new Date(localDate + 'T12:00:00'), TIMEZONE_BR);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erro ao converter data para UTC:', error);
    return null;
  }
};
```

## Regras de Negócio

### 1. Cálculo de Desconto

O desconto é aplicado sobre o valor da energia sem taxas:

```
valor_desconto = (total_fatura - iluminacao_publica - outros_valores) * (percentual_desconto / 100)
```

### 2. Valor de Assinatura

O valor da assinatura representa a remuneração da cooperativa:

```
valor_assinatura = total_fatura - valor_desconto - fatura_concessionaria
```

### 3. Regras de Transição de Status

As transições de status seguem regras específicas:

- Uma fatura só pode ser marcada como "paga" se tiver status "enviada", "corrigida", "reenviada" ou "atrasada"
- Uma fatura só pode ser marcada como "atrasada" se tiver status "enviada", "corrigida" ou "reenviada" e a data atual for posterior à data de vencimento
- Uma fatura só pode ser marcada como "finalizada" se tiver status "paga"

## Integrações

### 1. Banco de Dados (Supabase)

O módulo faz uso intensivo do Supabase para persistência de dados:

```typescript
// Exemplo de operação de banco de dados
const { data, error } = await supabase
  .from("faturas")
  .update(faturaData)
  .eq("id", id)
  .select("*")
  .single();
```

### 2. Geração de PDFs

O módulo integra-se com componentes de geração de PDF para criar faturas em formato PDF.

## Relatórios e Análises

O módulo fornece dashboards para análise de faturamento:

1. **Faturas por Status**: Contagem e valor total agrupados por status
2. **Tendência de Pagamentos**: Análise temporal de faturas pagas vs pendentes
3. **Economia Gerada**: Cálculo de economia total gerada pelo desconto

## Considerações de Performance

1. **Carregamento Otimizado**: Faturas são carregadas apenas para o mês/ano selecionado
2. **Cache de Dados**: Uso de React Query para cache e invalidação
3. **Paginação**: Tabelas com paginação para grandes volumes de dados

## Fluxo Completo de Uma Fatura

1. **Criação**: Gerada automaticamente ou manualmente pelo administrador
2. **Preenchimento**: Dados de consumo e valores preenchidos
3. **Envio**: Enviada ao cooperado por email ou outro meio
4. **Pagamento**: Pagamento registrado manualmente ou via integração
5. **Finalização**: Fatura marcada como finalizada

## Próximas Melhorias

1. **Integração com Gateways de Pagamento**: Permitir pagamento online
2. **Envio Automático**: Automatizar o envio de faturas
3. **Importação de Dados**: Importar dados diretamente de arquivos da concessionária
4. **Relatórios Avançados**: Expandir capacidades analíticas
5. **Notificações Automáticas**: Alertas de vencimento e confirmação
