# Superclient - Spec Driven Development

## Princípios

1. **UI Congelada** - A UI está em MUI e não será alterada. Apenas wiring de props, handlers e estados.
2. **Spec First** - Toda funcionalidade nasce de uma spec antes do código.
3. **Vertical Slices** - Desenvolvimento por fatias verticais completas.
4. **Testável** - Critérios de aceitação sempre verificáveis.

## Estrutura

```
/specs
├── overview.md           # Este arquivo
├── testing.md            # Estratégia de testes
├── domains/              # Specs por domínio
│   ├── contacts.md
│   ├── pipeline.md
│   ├── finances.md
│   ├── notes.md
│   └── profile.md
├── api/                  # Contratos de API
│   └── client.md
└── adr/                  # Architecture Decision Records
    └── 001-spec-driven.md
```

## Estados Padrão

Todos os domínios seguem os mesmos estados:

| Estado    | Descrição                          |
|-----------|-----------------------------------|
| `idle`    | Estado inicial, sem ação          |
| `loading` | Operação em andamento             |
| `success` | Operação concluída com sucesso    |
| `empty`   | Sucesso mas sem dados             |
| `error`   | Operação falhou                   |

## Vertical Slices Planejados

### Slice 1: Search Infrastructure
- Debounce configurável
- ESC para limpar
- Sync com URL (query params)
- Hook reutilizável

### Slice 2: Category Filters
- Estado único de filtros
- Reset de filtros
- Persistência em localStorage

### Slice 3: CRUD Contacts
- Listar contatos
- Criar contato
- Editar contato
- Deletar contato

### Slice 4: Notes
- Buscar notas
- Abrir nota
- Criar nota

### Slice 5: Finances
- Listar gastos
- Criar gasto
- Gerenciar categorias

## Commits por Slice

Cada slice segue a ordem:
1. `spec: [slice] add specification`
2. `types: [slice] add domain types`
3. `api: [slice] add api client`
4. `state: [slice] add state management`
5. `test: [slice] add tests`
6. `wiring: [slice] connect to ui`

## Template de Spec

Ver cada arquivo de domínio para o template completo com:
- Contexto
- Objetivo
- Fora de escopo
- Fluxo do usuário
- Regras de negócio
- Estados possíveis
- Modelo de dados
- Contrato de API
- Erros e edge cases
- Observabilidade
- Critérios de aceitação
