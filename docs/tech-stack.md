
# Padronização de Idioma no Projeto

## Visão Geral

Este documento estabelece as diretrizes para padronização do idioma em todo o sistema Solar Energy. A utilização consistente do português brasileiro é essencial para manter a coerência da aplicação, melhorar a experiência do usuário e facilitar o desenvolvimento e manutenção.

## Princípios Básicos

1. **Idioma Principal**: Português brasileiro (pt-BR) em todos os aspectos do sistema
2. **Consistência**: Uniformidade no uso de termos em toda a aplicação
3. **Clareza**: Comunicação clara e direta com o usuário
4. **Acessibilidade**: Linguagem inclusiva e compreensível

## Áreas de Implementação

### 1. Interface do Usuário

- Todos os textos visíveis ao usuário devem estar em português brasileiro
- Incluindo: rótulos, botões, mensagens, tooltips, menus, etc.
- Formatação de data: DD/MM/AAAA (ex: 31/12/2024)
- Formatação de moeda: R$ 1.234,56 (com separador de milhar e vírgula decimal)
- Formatação numérica: 1.234,56 (com ponto como separador de milhar e vírgula decimal)

### 2. Código Fonte

- Comentários em português
- Nomes de variáveis, funções e classes seguem padrões camelCase/PascalCase, mas podem usar termos em português
- Mensagens de log em português
- Documentação de código (JSDoc) em português

### 3. Documentação

- Toda documentação técnica em português
- Manuais de usuário em português
- Guias de instalação e configuração em português
- Comentários em pull requests e issues em português

### 4. Banco de Dados

- Nomes de tabelas e colunas podem seguir convenções técnicas (inglês/snake_case)
- Comentários e documentação de esquema em português
- Dados de exemplo/seed em português quando relevante

### 5. APIs e Integrações

- Endpoints podem seguir convenções técnicas (inglês/kebab-case)
- Documentação da API em português
- Mensagens de erro retornadas em português

## Diretrizes para Tradução e Escrita

### Termos Técnicos

Alguns termos técnicos podem ser mantidos em inglês quando sua tradução:
- Não é amplamente aceita
- Poderia causar confusão
- É incomum no contexto técnico brasileiro

Exemplos: "upload", "backend", "frontend", "bug", "deploy"

### Abreviações e Siglas

- Usar abreviações conhecidas em português (ex: "núm." para número)
- Manter siglas técnicas em sua forma original (ex: "API", "PDF")
- Explicar siglas menos conhecidas na primeira ocorrência

### Consistência Terminológica

Manter um glossário de termos para garantir consistência:

| Termo em Inglês | Termo em Português |
|-----------------|-------------------|
| Dashboard | Painel |
| Settings | Configurações |
| Upload | Upload (manter) |
| Login | Entrar/Login |
| Logout | Sair |
| Search | Buscar/Pesquisar |
| Delete | Excluir (não "apagar" ou "deletar") |
| Edit | Editar |
| Save | Salvar |
| Cancel | Cancelar |
| User | Usuário |
| Password | Senha |

## Implementação

### Checklist para Revisão

- [ ] Todos os textos visíveis são exibidos em português
- [ ] Mensagens de erro são apresentadas em português
- [ ] Datas, números e valores monetários seguem o formato brasileiro
- [ ] Documentação atualizada em português
- [ ] Comentários de código em português
- [ ] Termos consistentes com o glossário

### Diretrizes para Equipe de Desenvolvimento

1. **Ao criar novos componentes**:
   - Todos os textos devem ser em português
   - Utilizar os formatos brasileiros para dados localizáveis

2. **Ao modificar código existente**:
   - Manter a consistência com o restante do código
   - Atualizar documentação relacionada

3. **Ao revisar código**:
   - Verificar se todos os textos visíveis estão em português
   - Confirmar se formatos de data, número e moeda estão corretos

## Ferramentas e Recursos

### Bibliotecas de Formatação

- **Datas**: date-fns com configuração pt-BR
- **Números e Moedas**: react-number-format com configuração brasileira
- **Validação**: zod com mensagens de erro em português

### Exemplo de Configuração

```typescript
// Configuração de formatação de data (date-fns)
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const dataFormatada = format(new Date(), "dd/MM/yyyy", {
  locale: ptBR
});

// Configuração de formatação de moeda
import { NumericFormat } from 'react-number-format';

<NumericFormat
  value={1234.56}
  displayType="text"
  thousandSeparator="."
  decimalSeparator=","
  prefix="R$ "
  decimalScale={2}
  fixedDecimalScale
/>
```

## Monitoramento e Manutenção

- Revisões periódicas para garantir a consistência
- Processo de revisão para novos textos adicionados ao sistema
- Atualização do glossário conforme necessário
- Feedback dos usuários sobre clareza e compreensão

## Conclusão

A padronização do idioma em português brasileiro em todo o sistema Solar Energy é fundamental para oferecer uma experiência de usuário coesa e profissional, além de facilitar o desenvolvimento e manutenção do sistema. Este documento serve como referência para garantir essa uniformidade em todos os aspectos do projeto.
