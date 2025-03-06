
# Stack Tecnológico

## Visão Geral

O Sistema Solar Energy utiliza tecnologias modernas para construir uma aplicação web responsiva, escalável e manutenível. A arquitetura é projetada para oferecer uma experiência fluida tanto em dispositivos desktop quanto móveis.

## Frontend

### Framework Principal

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Linguagem tipada que estende JavaScript
- **Vite**: Ferramenta de build rápida para desenvolvimento moderno

### UI e Estilização

- **Tailwind CSS**: Framework de CSS utilitário para design responsivo
- **shadcn/ui**: Biblioteca de componentes baseada em Radix UI
- **Lucide React**: Biblioteca de ícones SVG
- **React Number Format**: Para formatação de entradas numéricas
- **Sonner**: Sistema de notificações toast

### Gerenciamento de Estado

- **TanStack Query (React Query)**: Biblioteca para gerenciamento de estado de servidor
- **React Hook Form**: Para gerenciamento de formulários
- **Zod**: Para validação de esquemas

### Visualização de Dados

- **Recharts**: Biblioteca para criação de gráficos
- **@tanstack/react-table**: Para tabelas de dados interativas
- **@tanstack/react-virtual**: Para virtualização de listas e tabelas

### Roteamento

- **React Router Dom**: Biblioteca de roteamento para React

### Exportação e Documentos

- **jsPDF**: Biblioteca para geração de PDFs
- **jsPDF-AutoTable**: Plugin para jsPDF que facilita a criação de tabelas
- **React-PDF**: Para renderização de PDFs

## Backend

### Serviços Serverless

- **Supabase**: Plataforma de backend como serviço (BaaS)
  - Banco de dados PostgreSQL
  - Autenticação e autorização
  - Armazenamento de arquivos
  - Funções de edge e webhooks

## Infraestrutura

### Banco de Dados

- **PostgreSQL**: Banco de dados relacional com suporte a JSON
- **Row Level Security (RLS)**: Para controle de acesso a dados

### Armazenamento

- **Supabase Storage**: Para arquivos de faturas, comprovantes e outros documentos

### Funções e APIs

- **Edge Functions**: Para lógica de negócios e integrações com APIs terceiras
- **REST API**: Para comunicação entre frontend e backend

## Serviços Integrados

### Pagamentos

- **Cora API**: Integração para geração de boletos bancários

### Emails

- **Email Service**: Integração para envio de faturas e notificações

## Ferramentas de Desenvolvimento

### Linting e Formatação

- **ESLint**: Para linting de código
- **Prettier**: Para formatação de código

### Build e Deploy

- **GitHub Actions**: Para CI/CD
- **Vercel**: Para hosting da aplicação frontend
- **Supabase CLI**: Para gerenciamento de migrations

## Gerenciamento de Dependências

- **npm/Yarn**: Gerenciadores de pacotes JavaScript

## Considerações Técnicas

### Performance

- **Code Splitting**: Divisão do código para carregamento sob demanda
- **Lazy Loading**: Carregamento preguiçoso de componentes
- **Memoização**: Uso de React.memo e hooks de memoização
- **Virtualização**: Renderização eficiente de listas grandes

### Segurança

- **JWT**: Para autenticação
- **HTTPS**: Para comunicação segura
- **RLS Policies**: Para proteção de dados
- **Validação de Entrada**: Validação tanto no cliente quanto no servidor

### Acessibilidade

- **ARIA Labels**: Para melhorar a acessibilidade
- **Temas**: Suporte a tema claro e escuro
- **Responsividade**: Design adaptável a diferentes tamanhos de tela

### Internacionalização

- **Formato de Data**: Suporte ao formato de data brasileiro
- **Formato de Moeda**: Suporte ao formato de moeda brasileiro (R$)

## Ferramentas de Componentes Específicos

### Formatação de Entrada

#### CurrencyInput

O componente `CurrencyInput` é fundamental para a entrada de valores monetários no sistema:

```typescript
// Funcionalidades do CurrencyInput:
// - Formatação automática para o padrão brasileiro (1.234,56)
// - Conversão entre valores formatados e valores numéricos
// - Suporte a decimal scale configurável
// - Integração com React Hook Form
```

Implementação:

```tsx
export function CurrencyInput({ 
  value, 
  onChange, 
  className, 
  decimalScale = 2, 
  ...props 
}: CurrencyInputProps) {
  // Modificamos para receber o valor não-formatado
  const handleValueChange = (values: { formattedValue: string; value: string }) => {
    // Passamos o valor formatado para manter a consistência na interface
    onChange(values.formattedValue);
  };

  return (
    <NumericFormat
      customInput={Input}
      value={value}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={decimalScale}
      fixedDecimalScale
      className={cn(className)}
      allowNegative={false}
      type="text"
      {...props}
    />
  );
}
```

#### Funções de Parse de Valores

Para conversão entre formatos de string e número, utilizamos funções utilitárias:

```typescript
// Função para converter valores formatados em números:
export const parseValue = (value: string): number => {
  if (!value) return 0;

  try {
    // Remove espaços e substitui pontos (de milhares) por nada
    const cleanValue = value.replace(/\./g, '').trim();
    
    // Substitui a vírgula por ponto para conversão em número
    const numeroFinal = cleanValue.replace(',', '.');
    
    // Converte para número garantindo 2 casas decimais
    return parseFloat(parseFloat(numeroFinal).toFixed(2));
  } catch (error) {
    console.error('Erro ao converter valor:', value, error);
    return 0;
  }
};
```

### Formatação de Data

Para lidar com as complexidades de fuso horário e formatos de data, utilizamos:

```typescript
// Convertendo UTC para local:
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

// Convertendo local para UTC:
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

## Próximas Melhorias Tecnológicas

1. **PWA**: Implementação de Progressive Web App
2. **Testes Automatizados**: Jest e React Testing Library
3. **Monitoramento**: Sentry para rastreamento de erros
4. **Analytics**: Implementação de análise de uso
5. **Performance**: Otimizações adicionais de carregamento

## Considerações de Arquitetura

A escolha das tecnologias foi guiada pelos seguintes princípios:

1. **Manutenibilidade**: Código limpo, tipado e bem estruturado
2. **Escalabilidade**: Arquitetura que suporta crescimento
3. **Experiência do Usuário**: Interface responsiva e intuitiva
4. **Segurança**: Proteção de dados e autenticação robusta
5. **Custo-Benefício**: Soluções eficientes com custo controlado
