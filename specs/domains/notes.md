# Notes Domain

## Contexto

O módulo de notas permite criar, organizar e buscar notas com editor rich text. Suporta favoritos, arquivamento e emojis.

## Objetivo

Prover CRUD de notas com busca, favoritos, arquivamento e editor rich text.

## Fora de Escopo

- ❌ Alterações de UI, layout ou estilos
- ❌ Mudanças no editor rich text
- ❌ Novos componentes visuais

## Fluxo do Usuário

### Listar Notas
1. Usuário acessa /notas
2. Sistema carrega notas do localStorage
3. Sistema exibe sidebar com lista

### Criar Nota
1. Usuário clica em "Nova nota"
2. Sistema cria nota com título padrão
3. Sistema seleciona nova nota
4. Usuário edita título e conteúdo

### Buscar Notas
1. Usuário clica no ícone de busca
2. Campo de busca aparece
3. Usuário digita termo
4. Sistema filtra notas por título/conteúdo
5. ESC fecha busca e limpa

### Favoritar Nota
1. Usuário clica no ícone de estrela
2. Sistema marca como favorito
3. Nota aparece no topo da lista

### Arquivar Nota
1. Usuário clica em arquivar
2. Sistema move para arquivo
3. Nota não aparece na lista principal

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN01 | Título padrão é "Nova nota" |
| RN02 | Emoji padrão é aleatório |
| RN03 | Favoritos aparecem primeiro |
| RN04 | Arquivadas não aparecem na lista principal |
| RN05 | Busca pesquisa em título e conteúdo |
| RN06 | Auto-save a cada mudança |

## Estados Possíveis

```typescript
type NotesState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; notes: Note[]; selectedId: string | null }
  | { status: 'empty' }
  | { status: 'error'; error: string };
```

## Modelo de Dados

```typescript
interface Note {
  id: string;
  title: string;
  emoji: string;
  contentHtml: string;
  favorite: boolean;
  archived: boolean;
  links: NoteLink[];
  attachments: NoteAttachment[];
  createdAt: string;
  updatedAt: string;
}

interface NoteLink {
  id: string;
  label: string;
  url: string;
}

interface NoteAttachment {
  id: string;
  name: string;
  mime: string;
  size: number;
}

interface NotesFilters {
  query: string;
  showArchived: boolean;
}
```

## Contrato de API

### GET /api/notes
```typescript
// Response 200
{
  "notes": Note[]
}
```

### POST /api/notes
```typescript
// Request
{
  "title"?: string,
  "emoji"?: string
}

// Response 201
{
  "note": Note
}
```

### PUT /api/notes/:id
```typescript
// Request (partial)
{
  "title"?: string,
  "contentHtml"?: string,
  "favorite"?: boolean,
  "archived"?: boolean
}

// Response 200
{
  "note": Note
}
```

### DELETE /api/notes/:id
```typescript
// Response 204
```

## Erros e Edge Cases

| Cenário | Comportamento |
|---------|---------------|
| Sem notas | Exibe estado empty |
| Deletar nota selecionada | Seleciona próxima ou nenhuma |
| Busca sem resultados | Lista vazia com mensagem |
| Conteúdo muito grande | Trunca na preview |

## Critérios de Aceitação

- [ ] `GIVEN` sem notas `WHEN` criar nota `THEN` nota aparece selecionada
- [ ] `GIVEN` nota existe `WHEN` favoritar `THEN` aparece no topo
- [ ] `GIVEN` nota existe `WHEN` arquivar `THEN` não aparece na lista
- [ ] `GIVEN` busca ativa `WHEN` ESC `THEN` busca fecha e limpa
- [ ] `GIVEN` nota editada `WHEN` mudar título `THEN` auto-save dispara
