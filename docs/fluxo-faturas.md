
# Novo Fluxo de Gestão de Faturas

## Motivação da Mudança

O sistema foi reorganizado para criar uma separação clara de responsabilidades entre os módulos "Faturas" e "Financeiro", permitindo um controle mais inteligente e organizado do processo completo de faturamento.

## O Novo Fluxo

### 1. Módulo de Faturas
O módulo "Faturas" agora é responsável somente pelas etapas iniciais do ciclo de vida de uma fatura:

- **Geração da fatura** (status inicial: "gerada" / "pendente")
- **Correção de dados** (status: "corrigida")
- **Envio ao cliente** (status: "enviada" / "reenviada")

Neste módulo, o foco é na **preparação e envio** da fatura, garantindo que todos os dados estejam corretos antes de enviar ao cliente.

### 2. Módulo Financeiro
Após o envio da fatura ao cliente, o controle passa para o módulo "Financeiro" (Contas a Receber), que gerencia:

- **Acompanhamento de pagamentos** (status: "paga")
- **Gestão de atrasos** (status: "atrasada")
- **Finalização do processo** (status: "finalizada")

O módulo financeiro sincroniza automaticamente os status entre faturas e lançamentos financeiros.

## Diagrama de Fluxo

```
┌─────────────────────────────────┐              ┌────────────────────────────────┐
│       MÓDULO DE FATURAS         │              │       MÓDULO FINANCEIRO        │
│                                 │              │                                │
│  ┌────────┐    ┌────────────┐   │              │   ┌────────┐    ┌──────────┐   │
│  │Pendente├───►│  Enviada   ├───┼──────────────┼──►│Atrasada│    │  Paga    │   │
│  └────────┘    └────────────┘   │              │   └────┬───┘    └────┬─────┘   │
│      │              ▲           │              │        │              │        │
│      │              │           │              │        │              │        │
│      ▼              │           │              │        ▼              ▼        │
│  ┌────────┐    ┌────────────┐   │              │   ┌──────────────────────────┐ │
│  │Corrigida├───►  Reenviada │   │              │   │        Finalizada        │ │
│  └────────┘    └────────────┘   │              │   └──────────────────────────┘ │
│                                 │              │                                │
└─────────────────────────────────┘              └────────────────────────────────┘
```

## Implicações Para os Usuários

1. **Para gerar e enviar faturas**: Use o módulo Faturas
2. **Para gerenciar pagamentos e finalizar**: Use o módulo Financeiro (Contas a Receber)

## Sincronização Entre Módulos

- Quando uma fatura é enviada, automaticamente é criado um registro correspondente em Contas a Receber
- Ao registrar um pagamento no módulo financeiro, o status da fatura é atualizado automaticamente
- A sincronização pode ser forçada manualmente pelo botão "Sincronizar" na página de Contas a Receber

## Benefícios da Nova Estrutura

- **Separação clara de responsabilidades**: Cada módulo tem sua função bem definida
- **Controle financeiro centralizado**: Todos os pagamentos são gerenciados em um único lugar
- **Facilidade de auditoria**: Histórico completo de alterações de status em ambos os módulos
- **Interface mais simples**: O usuário tem apenas as ações relevantes para cada fase do processo
