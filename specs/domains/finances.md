# Finances Domain

## Contexto

O módulo de finanças permite registrar e categorizar gastos, visualizar relatórios e acompanhar despesas por período.

## Objetivo

Prover CRUD de gastos com categorização, busca, filtros e visualização agregada.

## Fora de Escopo

- ❌ Alterações de UI, layout ou estilos
- ❌ Novos gráficos ou visualizações
- ❌ Mudanças em componentes visuais

## Fluxo do Usuário

### Listar Gastos
1. Usuário acessa /financas
2. Sistema carrega gastos e categorias
3. Sistema exibe tabela e gráficos

### Criar Gasto
1. Usuário clica em "Adicionar gasto"
2. Sistema abre modal
3. Usuário preenche título, valor, categoria
4. Sistema valida e salva

### Filtrar por Categoria
1. Usuário seleciona categorias no filtro
2. Sistema filtra tabela e atualiza gráficos

### Buscar Gastos
1. Usuário digita no campo de busca
2. Sistema filtra por título

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN01 | Título é obrigatório |
| RN02 | Valor deve ser positivo |
| RN03 | Categoria é obrigatória |
| RN04 | Data de criação é automática |
| RN05 | Valores são em centavos (integer) |
| RN06 | Exibição formata para BRL |

## Estados Possíveis

```typescript
type FinancesState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; expenses: Expense[]; categories: Category[]; totals: Totals }
  | { status: 'empty' }
  | { status: 'error'; error: string };
```

## Modelo de Dados

```typescript
interface Expense {
  id: string;
  title: string;
  amount: number; // em centavos
  categoryId: string;
  comment?: string;
  contactIds?: string[];
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Totals {
  total: number;
  byCategory: Record<string, number>;
}

interface FinancesFilters {
  query: string;
  categoryIds: string[];
  dateRange?: { start: string; end: string };
}
```

## Contrato de API

### GET /api/expenses
```typescript
// Request
GET /api/expenses?categories=cat-1&start=2025-01-01&end=2025-12-31

// Response 200
{
  "expenses": Expense[],
  "totals": Totals
}
```

### POST /api/expenses
```typescript
// Request
{
  "title": string,
  "amount": number,
  "categoryId": string,
  "comment"?: string
}

// Response 201
{
  "expense": Expense
}

// Response 400
{
  "error": "validation_error",
  "fields": { "amount": "must_be_positive" }
}
```

### DELETE /api/expenses/:id
```typescript
// Response 204
```

## Erros e Edge Cases

| Cenário | Comportamento |
|---------|---------------|
| Valor zero | Erro de validação |
| Valor negativo | Erro de validação |
| Categoria deletada | Gasto mantém referência órfã |
| Sem gastos | Exibe estado empty |

## Critérios de Aceitação

- [ ] `GIVEN` sem gastos `WHEN` criar gasto de R$100 `THEN` total é R$100
- [ ] `GIVEN` gasto existe `WHEN` deletar `THEN` total atualiza
- [ ] `GIVEN` 2 categorias `WHEN` filtrar por 1 `THEN` só gastos dessa categoria
- [ ] `GIVEN` valor "abc" `WHEN` salvar `THEN` erro de validação
- [ ] `GIVEN` valor negativo `WHEN` salvar `THEN` erro de validação
