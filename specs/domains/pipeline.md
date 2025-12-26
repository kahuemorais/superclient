# Pipeline Domain

## Contexto

O pipeline é um quadro Kanban para gestão de tarefas organizadas em colunas. Permite arrastar tarefas entre colunas e gerenciar o fluxo de trabalho.

## Objetivo

Prover gestão de tarefas em formato Kanban com drag-and-drop, busca e filtros.

## Fora de Escopo

- ❌ Alterações de UI, layout ou estilos
- ❌ Novos componentes visuais
- ❌ Mudanças no drag-and-drop visual

## Fluxo do Usuário

### Visualizar Pipeline
1. Usuário acessa /pipeline
2. Sistema carrega colunas e tarefas
3. Sistema exibe quadro Kanban

### Criar Tarefa
1. Usuário clica em "Nova tarefa"
2. Sistema abre modal
3. Usuário preenche título e detalhes
4. Sistema valida e salva na primeira coluna

### Mover Tarefa
1. Usuário arrasta tarefa
2. Sistema atualiza coluna da tarefa
3. Sistema persiste nova posição

### Buscar Tarefas
1. Usuário digita no campo de busca
2. Sistema filtra tarefas visíveis
3. Colunas sem match ficam com indicador

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN01 | Título da tarefa é obrigatório |
| RN02 | Nova tarefa vai para primeira coluna |
| RN03 | Ordem das tarefas é persistida |
| RN04 | Colunas têm ordem fixa |
| RN05 | Busca filtra por título e descrição |

## Estados Possíveis

```typescript
type PipelineState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; columns: Column[]; tasks: Task[] }
  | { status: 'error'; error: string };
```

## Modelo de Dados

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  categoryIds: string[];
  contactIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
  color?: string;
}

interface PipelineFilters {
  query: string;
  categoryIds: string[];
}
```

## Contrato de API

### GET /api/pipeline
```typescript
// Response 200
{
  "columns": Column[],
  "tasks": Task[]
}
```

### POST /api/pipeline/tasks
```typescript
// Request
{
  "title": string,
  "description"?: string,
  "columnId": string
}

// Response 201
{
  "task": Task
}
```

### PATCH /api/pipeline/tasks/:id/move
```typescript
// Request
{
  "columnId": string,
  "order": number
}

// Response 200
{
  "task": Task
}
```

## Erros e Edge Cases

| Cenário | Comportamento |
|---------|---------------|
| Coluna sem tarefas | Exibe área de drop vazia |
| Mover para mesma coluna | Reordena apenas |
| Busca sem resultados | Todas colunas vazias visualmente |

## Critérios de Aceitação

- [ ] `GIVEN` pipeline vazio `WHEN` criar tarefa `THEN` aparece na primeira coluna
- [ ] `GIVEN` tarefa na coluna A `WHEN` mover para coluna B `THEN` tarefa aparece em B
- [ ] `GIVEN` busca "teste" `WHEN` tarefa "Teste 1" existe `THEN` apenas ela visível
- [ ] `GIVEN` tarefa criada `WHEN` recarregar página `THEN` tarefa persiste
