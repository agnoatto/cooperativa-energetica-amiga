
# Especificações de Tabelas do Sistema

## Visão Geral
Design inspirado no PipeDrive com funcionalidades avançadas para melhor usabilidade e controle dos dados tabulares.

## Características Principais

### 1. Layout e Visual
- **Cabeçalhos**:
  - Fixos durante scroll
  - Fundo branco ou levemente cinza (#F6F6F7)
  - Texto em cinza escuro (#403E43)
  - Sem negrito
  - Sombra sutil durante scroll

- **Células**:
  - Padding consistente (12px vertical, 16px horizontal)
  - Bordas muito sutis (#C8C8C9)
  - Altura confortável (44px)
  - Truncamento com ellipsis
  - Alinhamento baseado no tipo de dado:
    - Texto: esquerda
    - Números: direita
    - Status/Ações: centro

- **Interatividade**:
  - Hover suave nas linhas (#F1F1F1)
  - Cursor pointer em células clicáveis
  - Ações na última coluna
  - Botões de ação visíveis no hover

### 2. Funcionalidades Core

#### Redimensionamento de Colunas
- Handles de redimensionamento visíveis no hover
- Largura mínima por coluna
- Persistência das larguras no localStorage
- Feedback visual durante redimensionamento

#### Sistema de Paginação
- Controles:
  - Anterior/Próxima
  - Primeira/Última
  - Números de página
- Seletor de itens por página (10, 25, 50, 100)
- Indicador de total de registros
- Persistência da página atual

#### Ordenação
- Indicadores visuais:
  - Seta para cima/baixo
  - Estado neutro
- Suporte multi-coluna (Shift + Click)
- Ordem padrão definida por tabela
- Persistência da ordenação

#### Sistema de Busca
- Campo de busca global
- Filtros específicos por coluna
- Debounce de 300ms
- Highlight dos termos encontrados
- Teclas de atalho (Ctrl/Cmd + F)

#### Exportação
Formatos suportados:
- Excel (.xlsx)
- CSV
- PDF

Opções de exportação:
- Seleção de colunas
- Filtros aplicados
- Ordenação atual
- Todos os registros vs. Página atual

### 3. Controle de Acesso

#### Níveis de Permissão
- Visualização
- Edição
- Exclusão
- Exportação

#### Granularidade
- Por tabela
- Por registro
- Por ação

#### Feedback Visual
- Botões/ações desabilitados
- Tooltips informativos
- Mensagens de erro customizadas

### 4. Responsividade

#### Desktop
- Scroll horizontal suave
- Cabeçalhos fixos
- Todas as funcionalidades disponíveis

#### Tablet
- Layout adaptativo
- Scroll horizontal quando necessário
- Funcionalidades principais mantidas

#### Mobile
- Cards em vez de tabela
- Informações principais visíveis
- Ações em menu dropdown
- Pull to refresh

### 5. Performance

#### Virtualização
- Renderização apenas do visível
- Buffer de 5 itens acima/abaixo
- Altura fixa para otimização

#### Otimizações
- Memoização de componentes
- Debounce em operações pesadas
- Lazy loading de dados
- Cache de resultados

### 6. Acessibilidade

#### Navegação
- Suporte completo a teclado
- Focus management
- Skip links

#### ARIA
- Labels apropriados
- Role descriptions
- Estado atual

#### Visual
- Contraste adequado
- Indicadores de foco
- Modo alto contraste
- Suporte a zoom

## Bibliotecas Necessárias

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.x",
    "react-resizable-panels": "^2.x",
    "@tanstack/react-virtual": "^3.x",
    "xlsx": "^0.18.x",
    "papaparse": "^5.x"
  }
}
```

## Implementação

### Fase 1: Estrutura Base
1. Componentes base
2. Layout responsivo
3. Estilização inicial

### Fase 2: Funcionalidades Core
1. Redimensionamento
2. Paginação
3. Ordenação
4. Busca

### Fase 3: Recursos Avançados
1. Exportação
2. Virtualização
3. Permissões
4. Cache

### Fase 4: Polimento
1. Acessibilidade
2. Performance
3. Testes
4. Documentação

## Cores e Estilos

### Paleta Principal
```css
--table-header-bg: #F6F6F7;
--table-header-text: #403E43;
--table-border: #C8C8C9;
--table-hover: #F1F1F1;
--table-text: #222222;
--table-shadow: rgba(0, 0, 0, 0.05);
```

### Dimensões
```css
--table-cell-padding-y: 12px;
--table-cell-padding-x: 16px;
--table-row-height: 44px;
--table-header-height: 48px;
```

## Considerações de Implementação

### Estado Global
- Preferências do usuário
- Cache de dados
- Estado de filtros/ordenação

### API
- Paginação no backend
- Filtros compostos
- Ordenação multi-coluna
- Busca otimizada

### Cache
- localStorage para preferências
- React Query para dados
- Memoização de renders

### Testes
- Unit tests para lógica
- Integration tests para interações
- E2E para fluxos completos
- Visual regression

