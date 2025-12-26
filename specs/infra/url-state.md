# URL State Synchronization Infrastructure

## 1. Contexto

A sincronização entre estado da aplicação e URL é crítica para uma experiência de usuário consistente. Problemas comuns sem padronização:

- **Estado perdido no reload** - Usuário perde filtros, busca e paginação ao atualizar página
- **Back/forward quebrado** - Navegação do browser não restaura estado anterior
- **Deep links inválidos** - URLs compartilhadas não reproduzem o estado esperado
- **Inconsistência entre telas** - Cada domínio implementa sync de forma diferente
- **Race conditions** - Múltiplas atualizações concorrentes corrompem URL
- **Migração impossível** - Formato de URL não versionado dificulta evolução

A padronização da infraestrutura de URL state permite:

- Estado preservado em todas as situações
- Navegação do browser funcional
- Deep links confiáveis
- Comportamento previsível entre domínios
- Testabilidade isolada

## 2. Objetivo

Definir um contrato único de sincronização bidirecional entre estado de domínio e URL que possa ser usado por todas as telas sem duplicação de lógica. O mecanismo deve:

- Ser agnóstico de framework de roteamento
- Garantir determinismo e reversibilidade
- Isolar estado entre domínios
- Integrar com search, filters, paginação e ordenação
- Suportar navegação back/forward
- Permitir deep links e compartilhamento

## 3. Glossário

| Termo | Definição |
|-------|-----------|
| **URLState** | Representação raw dos query params como strings |
| **DomainState** | Estado tipado e validado do domínio |
| **DomainKey** | Identificador do domínio: `contacts`, `pipeline`, `finances`, `notes` |
| **ParamMap** | Mapeamento entre chaves de estado e nomes de params |
| **Serializer** | Função que converte DomainState → URLState |
| **Parser** | Função que converte URLState → DomainState |
| **SyncDirection** | Direção da sincronização: `url-to-state` ou `state-to-url` |
| **HistoryAction** | Tipo de modificação do histórico: `push` ou `replace` |

## 4. Princípios

### 4.1 URL como Fonte de Verdade Inicial

```
1. Usuário acessa URL com params
2. Sistema extrai params do URL
3. Sistema valida e parseia params
4. Sistema inicializa estado com valores parseados
5. Estado interno assume como fonte de verdade
```

### 4.2 Estado Interno como Fonte Após Interação

```
1. Estado já inicializado do URL
2. Usuário interage (busca, filtro, página)
3. Estado interno atualiza primeiro
4. Sistema sincroniza estado → URL
5. URL reflete estado atual
```

### 4.3 Determinismo

Dado o mesmo URLState, o DomainState resultante deve ser sempre idêntico:

```typescript
parse(serialize(state)) === state // Reversibilidade
serialize(parse(url)) === normalize(url) // Normalização
```

### 4.4 Reversibilidade

Qualquer estado representável em URL pode ser restaurado:

```typescript
const url1 = serialize(state1);
const state2 = parse(url1);
const url2 = serialize(state2);

url1 === url2 // true
deepEqual(state1, state2) // true
```

## 5. Modelo de Dados

### 5.1 URL State (Raw)

```typescript
interface URLState {
  /** Query params como strings */
  params: Record<string, string>;
  
  /** Pathname atual */
  pathname: string;
  
  /** Hash (se usado) */
  hash: string;
}

// Exemplo
{
  pathname: '/contacts',
  params: {
    q: 'joao',
    categories: 'cat-1,cat-2',
    page: '2',
    sort: 'name'
  },
  hash: ''
}
```

### 5.2 Domain State (Parsed)

```typescript
interface DomainURLState {
  /** Domínio deste estado */
  domainKey: DomainKey;
  
  /** Estado de busca */
  search: {
    query: string;
  };
  
  /** Estado de filtros */
  filters: Record<string, unknown>;
  
  /** Estado de paginação */
  pagination: {
    page: number;
    pageSize: number;
  };
  
  /** Estado de ordenação */
  sorting: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

type DomainKey = 'contacts' | 'pipeline' | 'finances' | 'notes';
```

### 5.3 Sync Status

```typescript
type SyncStatus = 
  | 'idle'      // Nenhuma operação em andamento
  | 'syncing'   // Sincronização em progresso
  | 'restored'  // Estado foi restaurado do URL
  | 'error';    // Erro na sincronização

interface SyncState {
  status: SyncStatus;
  lastSyncAt: number | null;
  lastRestoreAt: number | null;
  pendingSync: boolean;
  error: string | null;
}
```

### 5.4 Param Definition

```typescript
interface ParamDefinition<T = unknown> {
  /** Nome do param no URL */
  urlKey: string;
  
  /** Chave no estado do domínio */
  stateKey: string;
  
  /** Valor padrão */
  defaultValue: T;
  
  /** Serializa valor para string */
  serialize: (value: T) => string;
  
  /** Parseia string para valor tipado */
  parse: (param: string) => T;
  
  /** Valida valor parseado */
  validate: (value: T) => boolean;
  
  /** Se true, omite do URL quando igual ao default */
  omitDefault: boolean;
  
  /** Versão do formato (para migração) */
  version?: number;
}
```

### 5.5 Sync Config

```typescript
interface URLSyncConfig {
  /** Domínio */
  domainKey: DomainKey;
  
  /** Definições de params */
  params: ParamDefinition[];
  
  /** Debounce para escrita no URL (ms) */
  syncDebounce: number;
  
  /** Usar push ou replace por padrão */
  defaultHistoryAction: HistoryAction;
  
  /** Callback após restore */
  onRestore?: (state: DomainURLState) => void;
  
  /** Callback após sync */
  onSync?: (url: string) => void;
}

const DEFAULT_CONFIG: Partial<URLSyncConfig> = {
  syncDebounce: 100,
  defaultHistoryAction: 'replace',
};
```

## 6. Regras de Sincronização

### 6.1 Inicialização (URL → State)

```typescript
function initFromURL(config: URLSyncConfig): DomainURLState {
  const url = new URL(window.location.href);
  const state: Record<string, unknown> = {};
  
  config.params.forEach(param => {
    const rawValue = url.searchParams.get(param.urlKey);
    
    if (rawValue === null) {
      // Param ausente = default
      state[param.stateKey] = param.defaultValue;
    } else {
      // Tenta parse
      const parsed = param.parse(rawValue);
      
      if (param.validate(parsed)) {
        state[param.stateKey] = parsed;
      } else {
        // Valor inválido = fallback para default
        console.warn(`[URLSync] Invalid param "${param.urlKey}": ${rawValue}`);
        state[param.stateKey] = param.defaultValue;
      }
    }
  });
  
  return state as DomainURLState;
}
```

### 6.2 Escrita (State → URL)

```typescript
function syncToURL(
  state: DomainURLState, 
  config: URLSyncConfig,
  action: HistoryAction = config.defaultHistoryAction
): void {
  const url = new URL(window.location.href);
  
  config.params.forEach(param => {
    const value = state[param.stateKey];
    const isDefault = deepEqual(value, param.defaultValue);
    
    if (isDefault && param.omitDefault) {
      // Remove param se é valor default
      url.searchParams.delete(param.urlKey);
    } else {
      // Serializa e adiciona
      const serialized = param.serialize(value);
      url.searchParams.set(param.urlKey, serialized);
    }
  });
  
  // Normaliza ordem dos params (determinismo)
  url.searchParams.sort();
  
  const newURL = url.toString();
  
  if (action === 'push') {
    history.pushState(null, '', newURL);
  } else {
    history.replaceState(null, '', newURL);
  }
}
```

### 6.3 Debounce de Escrita

```typescript
let syncTimeout: number | null = null;
let pendingState: DomainURLState | null = null;

function debouncedSyncToURL(
  state: DomainURLState,
  config: URLSyncConfig,
  action?: HistoryAction
): void {
  pendingState = state;
  
  if (syncTimeout !== null) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(() => {
    if (pendingState) {
      syncToURL(pendingState, config, action);
      pendingState = null;
    }
    syncTimeout = null;
  }, config.syncDebounce);
}
```

### 6.4 Isolamento por Domínio

Cada domínio gerencia apenas seus próprios params:

```typescript
// Contacts gerencia: q, categories, page, sort
// Pipeline gerencia: q, status, priority, page
// Finances gerencia: q, categories, amount_min, amount_max, page
// Notes gerencia: q, archived, page

// Ao navegar de /contacts?q=joao&page=2 para /pipeline
// - /contacts preserva seu estado isoladamente
// - /pipeline inicia com seus defaults ou seu próprio URL state
```

### 6.5 Namespace de Params

Opção A: Prefixo por domínio (quando múltiplos domínios coexistem):

```
/dashboard?c_q=joao&c_page=2&f_categories=cat-1
           ^^^                ^^^
           contacts           finances
```

Opção B: Sem prefixo (uma rota por domínio - recomendado):

```
/contacts?q=joao&page=2
/finances?categories=cat-1
```

### 6.6 Reset Parcial vs Total

```typescript
// Reset parcial: limpa apenas alguns params
function resetParams(keys: string[], config: URLSyncConfig): void {
  const url = new URL(window.location.href);
  
  keys.forEach(key => {
    const param = config.params.find(p => p.stateKey === key);
    if (param) {
      if (param.omitDefault) {
        url.searchParams.delete(param.urlKey);
      } else {
        url.searchParams.set(param.urlKey, param.serialize(param.defaultValue));
      }
    }
  });
  
  history.replaceState(null, '', url.toString());
}

// Reset total: limpa todos os params do domínio
function resetAllParams(config: URLSyncConfig): void {
  const keys = config.params.map(p => p.stateKey);
  resetParams(keys, config);
}
```

## 7. Integração com Search e Filters

### 7.1 Ordem de Aplicação

```
1. URL parseado
2. Search restaurado (q=valor)
3. Filters restaurados (categories=..., status=...)
4. Pagination restaurada (page=...)
5. Sorting restaurada (sort=...)
6. Consumidores notificados em ordem:
   a. Search aplica debounced query
   b. Filters aplicam valores
   c. Lista filtra dados
   d. Pagination ajusta se necessário
```

### 7.2 Resets Encadeados

```typescript
// Alterar search → reset page
function onSearchChange(query: string): void {
  state.search.query = query;
  state.pagination.page = 1; // Reset
  debouncedSyncToURL(state, config);
}

// Alterar filter → reset page
function onFilterChange(key: string, value: unknown): void {
  state.filters[key] = value;
  state.pagination.page = 1; // Reset
  debouncedSyncToURL(state, config);
}

// Alterar page → não reseta nada
function onPageChange(page: number): void {
  state.pagination.page = page;
  debouncedSyncToURL(state, config);
}
```

### 7.3 Cancelamento de Syncs Concorrentes

```typescript
let currentSyncId = 0;

async function syncWithValidation(state: DomainURLState): Promise<void> {
  const syncId = ++currentSyncId;
  
  // Debounce
  await delay(config.syncDebounce);
  
  // Verifica se outra sync foi iniciada
  if (syncId !== currentSyncId) {
    return; // Cancela esta sync
  }
  
  syncToURL(state, config);
}
```

## 8. Paginação e Ordenação

### 8.1 Definição de Params

```typescript
const paginationParams: ParamDefinition[] = [
  {
    urlKey: 'page',
    stateKey: 'pagination.page',
    defaultValue: 1,
    serialize: (v) => String(v),
    parse: (p) => Math.max(1, parseInt(p, 10) || 1),
    validate: (v) => Number.isInteger(v) && v >= 1,
    omitDefault: true, // page=1 não aparece no URL
  },
  {
    urlKey: 'size',
    stateKey: 'pagination.pageSize',
    defaultValue: 20,
    serialize: (v) => String(v),
    parse: (p) => parseInt(p, 10) || 20,
    validate: (v) => [10, 20, 50, 100].includes(v),
    omitDefault: true,
  },
];

const sortingParams: ParamDefinition[] = [
  {
    urlKey: 'sort',
    stateKey: 'sorting.sortBy',
    defaultValue: 'createdAt',
    serialize: (v) => v,
    parse: (p) => p,
    validate: (v) => ALLOWED_SORT_FIELDS.includes(v),
    omitDefault: true,
  },
  {
    urlKey: 'order',
    stateKey: 'sorting.sortOrder',
    defaultValue: 'desc',
    serialize: (v) => v,
    parse: (p) => p === 'asc' ? 'asc' : 'desc',
    validate: (v) => v === 'asc' || v === 'desc',
    omitDefault: true,
  },
];
```

### 8.2 Reset ao Mudar Search/Filters

```typescript
// Deps: search ou filters mudam → page reseta
const resetDeps = ['search.query', 'filters.*'];

function shouldResetPagination(changedKey: string): boolean {
  return resetDeps.some(dep => {
    if (dep.endsWith('.*')) {
      return changedKey.startsWith(dep.replace('.*', ''));
    }
    return changedKey === dep;
  });
}
```

### 8.3 Fallback Seguro

```typescript
function validatePagination(state: DomainURLState, totalItems: number): void {
  const { page, pageSize } = state.pagination;
  const maxPage = Math.ceil(totalItems / pageSize) || 1;
  
  if (page > maxPage) {
    // URL tinha page=10 mas só existem 3 páginas
    state.pagination.page = maxPage;
    debouncedSyncToURL(state, config);
  }
}
```

## 9. Navegação e Histórico

### 9.1 Push vs Replace

| Cenário | Ação | Razão |
|---------|------|-------|
| Mudança de search | `replace` | Evita histórico poluído por cada keystroke |
| Mudança de filtro | `push` | Permite voltar ao estado anterior |
| Mudança de página | `push` | Permite navegar entre páginas |
| Reset de filtros | `push` | Permite "desfazer" o reset |
| Correção de page inválida | `replace` | Não é ação do usuário |

### 9.2 Listener de Back/Forward

```typescript
function setupHistoryListener(config: URLSyncConfig): () => void {
  const handler = (event: PopStateEvent) => {
    const newState = initFromURL(config);
    
    // Notifica consumidores
    config.onRestore?.(newState);
    
    // Dispara evento
    dispatchEvent(new CustomEvent('url-state-restored', {
      detail: { domainKey: config.domainKey, state: newState }
    }));
  };
  
  window.addEventListener('popstate', handler);
  
  // Retorna cleanup function
  return () => window.removeEventListener('popstate', handler);
}
```

### 9.3 Deep Links

```typescript
// Geração de deep link
function generateDeepLink(state: DomainURLState, config: URLSyncConfig): string {
  const url = new URL(window.location.origin + window.location.pathname);
  
  config.params.forEach(param => {
    const value = state[param.stateKey];
    const isDefault = deepEqual(value, param.defaultValue);
    
    if (!isDefault || !param.omitDefault) {
      url.searchParams.set(param.urlKey, param.serialize(value));
    }
  });
  
  url.searchParams.sort();
  return url.toString();
}

// Exemplo de uso
const shareableLink = generateDeepLink(currentState, contactsConfig);
// "https://app.example.com/contacts?q=joao&categories=cat-1,cat-2&page=2"
```

## 10. Edge Cases

### 10.1 URL Inválida

| Cenário | Comportamento |
|---------|---------------|
| `?page=abc` | Parse falha, usa default (1) |
| `?page=-5` | Validação falha, usa default (1) |
| `?sort=invalid` | Validação falha, usa default |
| `?categories=` | Parse retorna [], que é válido |

```typescript
function safeParseParam<T>(
  rawValue: string | null,
  param: ParamDefinition<T>
): T {
  if (rawValue === null) {
    return param.defaultValue;
  }
  
  try {
    const parsed = param.parse(rawValue);
    
    if (param.validate(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn(`[URLSync] Parse error for "${param.urlKey}"`, error);
  }
  
  return param.defaultValue;
}
```

### 10.2 Params Desconhecidos

```typescript
// Params não definidos no config são preservados
function syncToURL(state: DomainURLState, config: URLSyncConfig): void {
  const url = new URL(window.location.href);
  const knownParams = new Set(config.params.map(p => p.urlKey));
  
  // Atualiza params conhecidos
  config.params.forEach(param => {
    // ... lógica de sync
  });
  
  // Params desconhecidos permanecem intactos
  // Ex: utm_source, ref, etc.
  
  history.replaceState(null, '', url.toString());
}
```

### 10.3 Migração de Formato

```typescript
interface ParamMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (oldValue: string) => string;
}

const migrations: ParamMigration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    // categories: "1,2,3" → "cat-1,cat-2,cat-3"
    migrate: (v) => v.split(',').map(id => `cat-${id}`).join(','),
  },
];

function parseWithMigration<T>(
  rawValue: string,
  param: ParamDefinition<T>,
  currentVersion: number
): T {
  let value = rawValue;
  
  // Aplica migrações necessárias
  migrations
    .filter(m => m.fromVersion < currentVersion && m.toVersion <= currentVersion)
    .sort((a, b) => a.fromVersion - b.fromVersion)
    .forEach(m => {
      value = m.migrate(value);
    });
  
  return param.parse(value);
}
```

### 10.4 Links Externos

```typescript
// Validação de URL antes de aplicar estado
function isInternalURL(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

// Deep links de fontes externas são tratados com cuidado
function handleExternalDeepLink(url: string): void {
  if (!isInternalURL(url)) {
    console.warn('[URLSync] Ignoring external URL');
    return;
  }
  
  const state = initFromURL(config);
  
  // Validação extra para links externos
  sanitizeExternalState(state);
  
  applyState(state);
}
```

### 10.5 Tab/Window Sync

```typescript
// Opcional: sincronizar entre abas
function setupStorageListener(config: URLSyncConfig): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key === `url-state:${config.domainKey}`) {
      const newState = JSON.parse(event.newValue || '{}');
      // Notifica sem modificar URL (outra aba já modificou)
      config.onRestore?.(newState);
    }
  };
  
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
```

## 11. Observabilidade

### 11.1 Eventos

| Evento | Payload | Quando |
|--------|---------|--------|
| `url_state_init` | `{ domainKey, state, fromURL }` | Estado inicializado do URL |
| `url_state_sync` | `{ domainKey, state, action }` | Estado sincronizado para URL |
| `url_state_restored` | `{ domainKey, state, trigger }` | Estado restaurado (back/forward) |
| `url_state_error` | `{ domainKey, param, value, error }` | Erro de parse/validação |
| `url_state_migrated` | `{ domainKey, param, from, to }` | Param migrado de versão |

### 11.2 Métricas

```typescript
interface URLSyncMetrics {
  /** Tempo de parse do URL */
  parseTime: number;
  
  /** Tempo de serialize do estado */
  serializeTime: number;
  
  /** Quantidade de params parseados */
  paramCount: number;
  
  /** Quantidade de params com erro */
  errorCount: number;
  
  /** Quantidade de migrações aplicadas */
  migrationCount: number;
  
  /** Quantidade de restores (back/forward) */
  restoreCount: number;
}
```

### 11.3 Logging

```typescript
// Formato de log estruturado
{
  level: 'info',
  event: 'url_state_sync',
  domainKey: 'contacts',
  state: {
    search: { query: 'joao' },
    filters: { categories: ['cat-1'] },
    pagination: { page: 2 }
  },
  action: 'push',
  url: '/contacts?q=joao&categories=cat-1&page=2',
  timestamp: 1735228800000
}
```

## 12. Critérios de Aceitação Testáveis

### 12.1 Inicialização

- [ ] `GIVEN` URL /contacts?q=joao `WHEN` carregar página `THEN` state.search.query = "joao"
- [ ] `GIVEN` URL /contacts?page=5 `WHEN` carregar `THEN` state.pagination.page = 5
- [ ] `GIVEN` URL sem params `WHEN` carregar `THEN` todos os valores são default
- [ ] `GIVEN` URL com param inválido `WHEN` carregar `THEN` usa default sem erro

### 12.2 Sincronização

- [ ] `GIVEN` state.search.query = "maria" `WHEN` sync `THEN` URL contém q=maria
- [ ] `GIVEN` state com valores default `WHEN` sync `THEN` params omitidos do URL
- [ ] `GIVEN` múltiplas mudanças rápidas `WHEN` sync `THEN` apenas última persiste (debounce)

### 12.3 Navegação

- [ ] `GIVEN` URL /contacts?page=2 `WHEN` back para /contacts?page=1 `THEN` state.page = 1
- [ ] `GIVEN` histórico com 3 estados `WHEN` forward `THEN` estado restaurado corretamente
- [ ] `GIVEN` deep link externo `WHEN` acessar `THEN` estado aplicado corretamente

### 12.4 Isolamento

- [ ] `GIVEN` /contacts?q=joao `WHEN` navegar para /pipeline `THEN` pipeline não tem q=joao
- [ ] `GIVEN` filtros em contacts e pipeline `WHEN` sync `THEN` URLs independentes
- [ ] `GIVEN` reset em contacts `WHEN` verificar pipeline `THEN` pipeline inalterado

### 12.5 Integração

- [ ] `GIVEN` search change `WHEN` sync `THEN` page resetado para 1
- [ ] `GIVEN` filter change `WHEN` sync `THEN` page resetado para 1
- [ ] `GIVEN` page change `WHEN` sync `THEN` search/filters preservados

### 12.6 Edge Cases

- [ ] `GIVEN` URL com params desconhecidos `WHEN` sync `THEN` params preservados
- [ ] `GIVEN` page=999 mas só existem 3 páginas `WHEN` carregar `THEN` page ajustado
- [ ] `GIVEN` param versão antiga `WHEN` carregar `THEN` migração aplicada

## 13. Integração com Domínios

### 13.1 Contrato de Uso

```typescript
// 1. Definir config do domínio
const contactsURLConfig: URLSyncConfig = {
  domainKey: 'contacts',
  params: [
    ...searchParams,
    ...contactsFilterParams,
    ...paginationParams,
    ...sortingParams,
  ],
  syncDebounce: 100,
  defaultHistoryAction: 'replace',
  onRestore: (state) => {
    contactsStore.applyState(state);
  },
};

// 2. Inicializar no mount
useEffect(() => {
  const state = initFromURL(contactsURLConfig);
  contactsStore.applyState(state);
  
  const cleanup = setupHistoryListener(contactsURLConfig);
  return cleanup;
}, []);

// 3. Sincronizar em mudanças
function onSearchChange(query: string) {
  state.search.query = query;
  state.pagination.page = 1;
  debouncedSyncToURL(state, contactsURLConfig);
}
```

### 13.2 Composição com Search e Filters

```typescript
// URL State compõe search e filters
const fullURLConfig: URLSyncConfig = {
  domainKey: 'contacts',
  params: [
    // Search (de /specs/infra/search.md)
    {
      urlKey: 'q',
      stateKey: 'search.query',
      defaultValue: '',
      serialize: (v) => v.trim(),
      parse: (p) => p,
      validate: (v) => typeof v === 'string' && v.length <= 200,
      omitDefault: true,
    },
    // Filters (de /specs/infra/filters.md)
    {
      urlKey: 'categories',
      stateKey: 'filters.categoryIds',
      defaultValue: [],
      serialize: (v) => v.sort().join(','),
      parse: (p) => p ? p.split(',') : [],
      validate: (v) => Array.isArray(v),
      omitDefault: true,
    },
    // Pagination
    {
      urlKey: 'page',
      stateKey: 'pagination.page',
      defaultValue: 1,
      serialize: (v) => String(v),
      parse: (p) => parseInt(p, 10) || 1,
      validate: (v) => v >= 1,
      omitDefault: true,
    },
  ],
  syncDebounce: 100,
};
```

## 14. Não Incluído Nesta Spec

Esta especificação **não cobre**:

- Implementação visual de componentes
- Framework de roteamento específico (React Router, Wouter, etc.)
- Estilos ou layout
- Server-side rendering
- SEO e meta tags

Esses aspectos são responsabilidade de outras camadas ou specs específicas.
