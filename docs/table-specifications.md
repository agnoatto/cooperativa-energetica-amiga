
# Especificações de Tabelas do Sistema

## Visão Geral
Design inspirado no PipeDrive para melhor usabilidade e controle de dados tabulares.

## Layout e Visual

### Cabeçalhos
- Fixos durante scroll com sombra sutil
- Fundo: #F6F6F7, Texto: #403E43
- Sem negrito

### Células
- Padding: 12px vertical, 16px horizontal
- Altura: 44px, bordas sutis (#C8C8C9)
- Truncamento com ellipsis
- Alinhamento baseado no tipo de dado (texto: esquerda, números: direita)

### Interatividade
- Hover nas linhas: #F1F1F1
- Ações visíveis no hover da última coluna

## Funcionalidades Core

### Redimensionamento de Colunas
- Handles visíveis no hover com largura mínima
- Persistência no localStorage
- Feedback visual durante redimensionamento

### Paginação
- Controles: navegação e seletor de itens por página (10, 25, 50, 100)
- Indicador de total de registros
- Persistência da página atual

### Ordenação
- Indicadores visuais com estado neutro
- Suporte multi-coluna (Shift + Click)
- Persistência da ordenação

### Sistema de Busca
- Campo global e filtros específicos por coluna
- Debounce de 300ms com highlight dos termos
- Atalhos: Ctrl/Cmd + F

### Exportação
- Formatos: Excel, CSV, PDF
- Opções: seleção de colunas, filtros aplicados, ordenação

## Controle de Acesso

### Permissões
- Níveis: visualização, edição, exclusão, exportação
- Granularidade: por tabela, registro ou ação
- Feedback visual para ações indisponíveis

## Responsividade

### Desktop
- Scroll horizontal suave com cabeçalhos fixos

### Tablet
- Layout adaptativo mantendo funcionalidades principais

### Mobile
- Cards em vez de tabela com ações em menu dropdown

## Performance

### Virtualização
- Renderização apenas do visível com buffer de 5 itens
- Altura fixa para otimização

### Otimizações
- Memoização, debounce, lazy loading e cache

## Acessibilidade
- Navegação completa por teclado
- ARIA labels e contraste adequado
- Suporte a zoom e modo alto contraste

## Tecnologias Recomendadas
```
@tanstack/react-table, react-resizable-panels, @tanstack/react-virtual,
xlsx, papaparse
```

## Implementação

### Fases
1. **Estrutura Base**: componentes, layout e estilos
2. **Funcionalidades Core**: redimensionamento, paginação, ordenação
3. **Recursos Avançados**: exportação, virtualização, permissões
4. **Polimento**: acessibilidade, performance, testes

## Estilo e Cores

### Paleta
```css
--table-header-bg: #F6F6F7;
--table-header-text: #403E43;
--table-border: #C8C8C9;
--table-hover: #F1F1F1;
--table-text: #222222;
```

### Dimensões
```css
--table-cell-padding-y: 12px;
--table-cell-padding-x: 16px;
--table-row-height: 44px;
--table-header-height: 48px;
```

## Considerações Adicionais
- Estado global para preferências e cache
- API com paginação no backend
- Testes unitários, de integração e E2E
