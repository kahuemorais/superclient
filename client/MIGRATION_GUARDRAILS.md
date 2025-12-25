# Migration Guardrails: MUI → Vanilla Extract

## Objetivo
Prevenir regressões visuais e arquiteturais durante a migração gradual de MUI para Vanilla Extract.

## ✅ Checklist Obrigatório (Toda PR/Mudança)

### 1. **Alinhamento Horizontal**
- [ ] Breadcrumb/TopRow alinhado perfeitamente com o conteúdo da página
- [ ] `diff = 0px` entre `breadcrumb.getBoundingClientRect().left` e `firstControl.getBoundingClientRect().left`
- [ ] BreadcrumbFrame NÃO tem padding horizontal próprio
- [ ] PageContainer é a ÚNICA fonte de padding horizontal (`--sc-page-px-mobile/desktop`)

### 2. **Actions Layout (Desktop)**
- [ ] Breadcrumb e actions sempre na mesma linha (topRow com `flexWrap: nowrap`)
- [ ] Actions não quebram para linha abaixo
- [ ] Overflow horizontal com scroll customizado se necessário

### 3. **Navbar Mobile**
- [ ] Links do nav escondidos (apenas menu hamburger visível)
- [ ] Apenas 1 ícone de notificação (sem duplicatas)
- [ ] Notificação, avatar e hamburger sem borda/fundo extra no estado default
- [ ] MobileRightGroup agrupa corretamente os elementos

### 4. **Hover/Active States**
- [ ] NUNCA usar `transform: translateY()` para elevar
- [ ] NUNCA usar `box-shadow` crescente no hover
- [ ] Usar apenas mudanças sutis de background/border:
  - `--sc-card-hover-bg`
  - `--sc-card-hover-border`
  - `--sc-card-pressed-bg`

### 5. **Design Tokens (Zero Hardcode)**
- [ ] Nenhuma cor hex (`#...`) ou `rgba()` hardcoded em componentes novos
- [ ] Usar tokens do `designTokens.ts`:
  - Material Design: `--md-sys-color-*`
  - Custom: `--sc-card-*`, `--sc-input-*`, `--sc-page-*`
- [ ] `color-mix()` para variações de alpha (ex: `color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)`)

### 6. **Layout Structure**
- [ ] PageContainer structure:
  ```
  <PageContainer>
    {breadcrumb/actions && <topRow>...}
    {title/subtitle && <titleRow>...}
    <pageContent>...
  ```
- [ ] Nenhum wrapper intermediário com padding/margin extra
- [ ] Primeiro filho de pageContent tem `marginTop: 0` (garantido por CSS)

### 7. **Component Migration Rules**
- [ ] Migrar 1 componente por vez
- [ ] Validar em 3 páginas: Home, Calendar, Notes
- [ ] Validar em 2 breakpoints: desktop (≥960px) e mobile (<960px)
- [ ] Zero mudança de grid/padding/containers da página original
- [ ] **TextField:** Sempre usar Signup.tsx como referência visual e comportamental
- [ ] **SearchField:** Sempre usar SearchField para campos de busca, NUNCA TextField VE direto

### 8. **Search Fields Standards**
- [ ] Todos os campos de busca usam `<SearchField />` (nunca TextField VE direto)
- [ ] Props obrigatórias: `value`, `onChange`, `placeholder`, `onClear`
- [ ] Largura controlada pelo container da página (Grid/Flex), não internamente
- [ ] ESC limpa o campo automaticamente
- [ ] Botão X condicional (aparece apenas com texto)
- [ ] Altura 56px (consistente com Select MUI)

## 🛠️ Pre-Commit Self-Check

Antes de marcar tarefa como "done":

1. **Build sem erros**
   ```bash
   pnpm build
   ```

2. **Console limpo**
   - Sem warnings TypeScript novos
   - Sem erros de runtime no browser

3. **Visual Regression Test (Manual)**
   - ✅ Home (Dashboard): Cards, notificações, actions
   - ✅ Calendar: Breadcrumb, filtros, grid, sidebar
   - ✅ Notes: Breadcrumb, busca, lista, cards

4. **Responsive Test**
   - ✅ Desktop (≥960px): Navbar inline, actions mesma linha
   - ✅ Mobile (<960px): Navbar colapsado, topRow pode wrap

5. **Navbar Mobile Specific**
   - ✅ Notificação: apenas 1 ícone, badge correto
   - ✅ Avatar: sem borda extra
   - ✅ Hamburger: sem fundo no estado default

## 📋 Migration Priority (Safe Order)

### Phase 1: Base Components (Completed ✅)
- [x] Card (Vanilla Extract)
- [x] CardSection (Vanilla Extract)
- [x] TextField (Vanilla Extract) - **Referência: Signup.tsx**
- [x] SearchField (Vanilla Extract) - **Componente único para todos os campos de busca**
- [x] PageContainer (Vanilla Extract)
- [x] TopRow/TitleRow architecture
- [x] BreadcrumbContext

**TextField Canonical Reference:**
- `client/src/pages/Signup.tsx` é o exemplo canônico de uso do TextField
- Toda nova migração de TextField DEVE se comportar exatamente igual ao Signup
- Consulte `client/src/ui/TextField/TEXTFIELD_USAGE.md` para guia completo

**SearchField Canonical Reference:**
- `client/src/ui/SearchField/SearchField.tsx` é o componente único para TODOS os campos de busca do app
- **NUNCA** usar TextField VE diretamente para implementar busca
- **SEMPRE** usar `<SearchField />` com props padronizadas:
  - `value`: estado do texto de busca
  - `onChange`: handler para mudança de texto
  - `placeholder`: texto interno do campo (não usar label externa)
  - `onClear`: handler para limpar campo (ESC também limpa automaticamente)
  - `fullWidth`: true para ocupar 100% do container
  - `ariaLabel`: acessibilidade
- Altura padrão: 56px (consistente com Select MUI)
- Botão X aparece condicionalmente quando há texto
- ESC limpa o campo automaticamente
- Layout: largura controlada pelo container da página via Grid/Flex, nunca internamente
- Páginas usando SearchField: Contacts, Pipeline, Finanças, Support, Notes, AccessManagement

### Phase 2: Form Components (Next)
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Textarea

### Phase 3: Complex Components
- [ ] Autocomplete
- [ ] DatePicker
- [ ] Dialog/Modal
- [ ] Tabs

### Phase 4: Layout Components
- [ ] AppBar (partial migration, keep MUI base)
- [ ] Drawer
- [ ] Menu

## 🚨 Red Flags (Immediate Rollback)

- ❌ Breadcrumb não alinha com conteúdo (diff > 2px)
- ❌ Actions duplicadas ou em linha errada
- ❌ Notificação duplicada no mobile
- ❌ Hover com elevação (transform/shadow)
- ❌ Cores hardcoded em novos componentes
- ❌ Padding horizontal em múltiplos níveis
- ❌ Build falha ou warnings TypeScript novos
- ❌ Console com erros de runtime

## 📝 Testing Snippet (DevTools Console)

```javascript
// Test horizontal alignment
const breadcrumb = document.querySelector('nav[aria-label="breadcrumb"]');
const firstControl = document.querySelector('.MuiAutocomplete-root, input, button');
const ax = breadcrumb?.getBoundingClientRect().left;
const bx = firstControl?.getBoundingClientRect().left;
console.log({ ax, bx, diff: Math.abs((bx || 0) - (ax || 0)) });
// Expected: diff = 0 (or max 1px)

// Test for duplicate notifications
const notifIcons = document.querySelectorAll('[aria-label*="notif" i], [aria-label*="notification" i]');
console.log({ notificationIconCount: notifIcons.length });
// Expected: 1 in mobile, 1 in desktop (same element)

// Test for hardcoded colors (in new components)
const newComponents = document.querySelectorAll('[class*="TextField"], [class*="VeCard"]');
newComponents.forEach(el => {
  const computed = window.getComputedStyle(el);
  if (computed.backgroundColor.match(/#[0-9a-f]{6}/i)) {
    console.warn('Hardcoded color found:', el, computed.backgroundColor);
  }
});
```

## 🎯 Success Metrics

- ✅ Zero regressões visuais em páginas existentes
- ✅ 100% dos novos componentes usam tokens
- ✅ Build time não aumenta significativamente
- ✅ TypeScript errors = 0
- ✅ Console warnings = 0 (relevantes)
- ✅ Alinhamento perfeito (diff ≤ 1px)
- ✅ Navbar mobile sem elementos duplicados
