# Contacts Domain

## Contexto

O módulo de contatos permite gerenciar informações de pessoas e organizações relacionadas ao usuário. Os dados são persistidos em localStorage e sincronizados com a API quando disponível.

## Objetivo

Prover CRUD completo de contatos com busca, filtros por categoria e persistência.

## Fora de Escopo

- ❌ Alterações de UI, layout ou estilos
- ❌ Novos componentes visuais
- ❌ Mudanças em TextField, Cards, etc.

## Fluxo do Usuário

### Listar Contatos
1. Usuário acessa /contatos
2. Sistema carrega contatos do localStorage
3. Sistema exibe lista ou estado vazio

### Buscar Contatos
1. Usuário digita no campo de busca
2. Sistema aplica debounce de 300ms
3. Sistema filtra por nome, email, telefone
4. ESC limpa a busca

### Criar Contato
1. Usuário clica em "Novo contato"
2. Sistema abre modal de criação
3. Usuário preenche campos obrigatórios
4. Sistema valida dados
5. Sistema salva e atualiza lista

### Editar Contato
1. Usuário clica em contato existente
2. Sistema abre modal de edição
3. Usuário modifica campos
4. Sistema valida e salva

### Deletar Contato
1. Usuário clica em deletar
2. Sistema solicita confirmação
3. Sistema remove e atualiza lista

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN01 | Nome é obrigatório e não pode ser vazio |
| RN02 | Email deve ser válido se informado |
| RN03 | Telefone aceita apenas números e caracteres especiais (+, -, (, )) |
| RN04 | Categorias são opcionais |
| RN05 | Busca é case-insensitive |
| RN06 | Busca pesquisa em: name, emails, phones |

## Estados Possíveis

```typescript
type ContactsState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; contacts: Contact[]; total: number }
  | { status: 'empty' }
  | { status: 'error'; error: string };
```

## Modelo de Dados

```typescript
interface Contact {
  id: string;
  name: string;
  birthday: string;
  phones: string[];
  emails: string[];
  addresses: string[];
  comments: string[];
  categoryIds: string[];
  role?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactCategory {
  id: string;
  name: string;
  color: string;
}

interface ContactsFilters {
  query: string;
  categoryIds: string[];
}
```

## Contrato de API

### GET /api/contacts
```typescript
// Request
GET /api/contacts?query=joao&categories=cat-1,cat-2

// Response 200
{
  "contacts": Contact[],
  "total": number
}

// Response 500
{
  "error": "internal_error",
  "message": string
}
```

### POST /api/contacts
```typescript
// Request
POST /api/contacts
{
  "name": string,
  "birthday"?: string,
  "phones"?: string[],
  "emails"?: string[],
  "categoryIds"?: string[]
}

// Response 201
{
  "contact": Contact
}

// Response 400
{
  "error": "validation_error",
  "fields": { [field]: string }
}
```

### PUT /api/contacts/:id
```typescript
// Request
PUT /api/contacts/:id
{
  "name"?: string,
  "birthday"?: string,
  // ... partial update
}

// Response 200
{
  "contact": Contact
}
```

### DELETE /api/contacts/:id
```typescript
// Response 204 (no content)

// Response 404
{
  "error": "not_found"
}
```

## Erros e Edge Cases

| Cenário | Comportamento |
|---------|---------------|
| localStorage vazio | Inicializa lista vazia |
| localStorage corrompido | Limpa e reinicia |
| Busca sem resultados | Exibe estado empty |
| Nome duplicado | Permite (não é único) |
| Deletar último contato | Lista fica vazia |

## Observabilidade

```typescript
// Eventos para analytics
analytics.track('contact_created', { categoryCount: number });
analytics.track('contact_deleted', { id: string });
analytics.track('contact_search', { query: string, resultCount: number });
```

## Critérios de Aceitação

- [ ] `GIVEN` lista vazia `WHEN` criar contato com nome "João" `THEN` lista tem 1 contato
- [ ] `GIVEN` contato "João" existe `WHEN` buscar "joão" `THEN` retorna 1 resultado
- [ ] `GIVEN` contato existe `WHEN` deletar `THEN` contato não aparece mais
- [ ] `GIVEN` busca ativa `WHEN` pressionar ESC `THEN` busca é limpa
- [ ] `GIVEN` filtro de categoria ativo `WHEN` reset `THEN` todos contatos visíveis
- [ ] `GIVEN` nome vazio `WHEN` salvar `THEN` exibe erro de validação
