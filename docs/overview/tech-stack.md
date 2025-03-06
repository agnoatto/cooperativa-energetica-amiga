
# Stack Tecnológico

## Visão Geral

O Sistema Solar Energy utiliza tecnologias modernas para construir uma aplicação web responsiva, escalável e manutenível, projetada para funcionar bem em dispositivos desktop e móveis.

## Frontend

### Core
- **React 18** com **TypeScript** e **Vite** para desenvolvimento rápido e tipagem segura

### UI e Estilização
- **Tailwind CSS** para design responsivo
- **shadcn/ui** para componentes consistentes baseados em Radix UI
- **Lucide React** para ícones SVG
- Formatação numérica através de **React Number Format**
- Sistema de notificações com **Sonner**

### Estado e Dados
- **TanStack Query** para gerenciamento de estado do servidor
- **React Hook Form** com **Zod** para validação de formulários
- **@tanstack/react-table** e **@tanstack/react-virtual** para tabelas interativas

### Visualização
- **Recharts** para gráficos e visualizações
- **React-PDF** e **jsPDF** (com **jsPDF-AutoTable**) para geração de documentos

## Backend (Supabase)

- Banco de dados **PostgreSQL** com Row Level Security
- Autenticação e autorização integradas
- Armazenamento para arquivos (faturas, comprovantes, etc.)
- Funções de edge e webhooks para lógica de negócios

## Padrões de Formatação Brasileiros

### Monetária
```typescript
// Exemplo de uso do CurrencyInput
<CurrencyInput
  value={valor}
  onChange={setValor}
  decimalScale={2}
  prefix="R$ "
/>
```

### Funções de Parse
```typescript
// Função para converter valores formatados em números
export const parseValue = (value: string): number => {
  if (!value) return 0;
  const cleanValue = value.replace(/\./g, '').trim();
  const numeroFinal = cleanValue.replace(',', '.');
  return parseFloat(parseFloat(numeroFinal).toFixed(2));
};
```

### Datas
```typescript
// Convertendo data UTC para formato local brasileiro
export const formatarData = (data: string | null) => {
  if (!data) return '';
  const dataObj = new Date(data);
  return format(dataObj, 'dd/MM/yyyy');
};
```

## Considerações Técnicas

### Performance
- Code splitting e lazy loading
- Memoização de componentes
- Virtualização para listas grandes

### Segurança
- JWT para autenticação
- HTTPS para comunicação segura
- Validação de entrada em cliente e servidor

### Acessibilidade e Internacionalização
- Suporte a tema claro e escuro
- Uso de ARIA labels
- Formatos brasileiros de data e moeda

## Próximas Melhorias

1. Implementação de PWA
2. Testes automatizados
3. Monitoramento de erros
4. Análise de uso
5. Otimizações adicionais de carregamento

## Princípios de Arquitetura

1. **Manutenibilidade**: Código limpo, tipado e bem estruturado
2. **Escalabilidade**: Suporte ao crescimento da base de usuários
3. **Experiência do Usuário**: Interface responsiva e intuitiva
4. **Segurança**: Proteção robusta de dados
5. **Custo-Benefício**: Soluções eficientes com custo controlado
