# Estratégia de Testes

## Níveis de Teste

### Unit Tests
- **Escopo**: Funções puras, validações, transformações
- **Framework**: Vitest
- **Cobertura mínima**: 80% para regras de negócio

```typescript
// Exemplo: validação de contato
describe('validateContact', () => {
  it('should require name', () => {
    const result = validateContact({ name: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name_required');
  });
});
```

### Integration Tests
- **Escopo**: API client + state management
- **Framework**: Vitest + MSW (Mock Service Worker)
- **Foco**: Fluxos completos sem UI

```typescript
// Exemplo: criar contato
describe('ContactsStore', () => {
  it('should create contact and update list', async () => {
    const store = createContactsStore();
    await store.create({ name: 'João' });
    expect(store.contacts).toHaveLength(1);
  });
});
```

### E2E Tests
- **Escopo**: Fluxos críticos de usuário
- **Framework**: Playwright
- **Cobertura**: Happy paths principais

```typescript
// Exemplo: buscar contato
test('user can search contacts', async ({ page }) => {
  await page.goto('/contatos');
  await page.fill('[data-testid="search"]', 'João');
  await expect(page.locator('[data-testid="contact-card"]')).toHaveCount(1);
});
```

## Estrutura de Arquivos

```
/client/src
├── domains/
│   ├── contacts/
│   │   ├── contacts.types.ts
│   │   ├── contacts.validation.ts
│   │   ├── contacts.validation.test.ts
│   │   ├── contacts.api.ts
│   │   ├── contacts.api.test.ts
│   │   ├── contacts.store.ts
│   │   └── contacts.store.test.ts
│   └── ...
└── ...

/e2e
├── contacts.spec.ts
├── notes.spec.ts
└── ...
```

## Critérios de Aceitação

Cada spec deve ter critérios verificáveis:

```markdown
## Critérios de Aceitação

- [ ] `GIVEN` lista vazia `WHEN` criar contato `THEN` lista tem 1 item
- [ ] `GIVEN` contato existente `WHEN` editar nome `THEN` nome atualizado
- [ ] `GIVEN` busca ativa `WHEN` ESC `THEN` busca limpa
```

## Mocks

### API Mocks (MSW)

```typescript
// mocks/handlers.ts
export const handlers = [
  rest.get('/api/contacts', (req, res, ctx) => {
    return res(ctx.json({ contacts: mockContacts }));
  }),
];
```

### localStorage Mocks

```typescript
// test/setup.ts
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: (key: string) => localStorageMock.store[key] || null,
  setItem: (key: string, value: string) => { localStorageMock.store[key] = value; },
  clear: () => { localStorageMock.store = {}; },
};
```

## CI/CD

```yaml
# Rodar em cada PR
test:
  - pnpm test:unit
  - pnpm test:integration
  
# Rodar antes de merge
test:e2e:
  - pnpm test:e2e
```
