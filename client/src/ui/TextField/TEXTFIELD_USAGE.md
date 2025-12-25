# TextField (Vanilla Extract) - Guia de Uso

Componente de input de texto padronizado usando Vanilla Extract e design tokens.

## Quando Usar

✅ **Use TextField Vanilla Extract para:**
- Inputs de texto simples (`type="text"`)
- Campos de email (`type="email"`)
- Campos de senha (`type="password"`)
- Campos numéricos (`type="number"`)
- Qualquer input HTML padrão que aceite texto

❌ **NÃO use para:**
- Select / Autocomplete (use componentes específicos)
- Checkbox / Radio (use componentes específicos)
- TextArea multilinha (pendente migração)
- Date pickers (pendente migração)

## Props Disponíveis

### Props Obrigatórias
```typescript
label: string              // Label visível do campo
```

### Props Comuns
```typescript
type?: string             // 'text' | 'email' | 'password' | 'number' | etc.
fullWidth?: boolean       // Default: true
required?: boolean        // Adiciona * vermelho no label
disabled?: boolean        // Desabilita o campo
placeholder?: string      // Texto de placeholder
```

### Props de Validação
```typescript
errorText?: string        // Mensagem de erro (torna campo vermelho)
helperText?: string       // Texto auxiliar abaixo do campo
```

### Props de Ícones
```typescript
startIcon?: ReactNode     // Ícone no início do campo
endIcon?: ReactNode       // Ícone no final do campo
```

### Props Nativas HTML
Todas as props de `InputHTMLAttributes<HTMLInputElement>` são suportadas:
- `value`, `onChange`, `onBlur`, `onFocus`
- `name`, `id`, `autoComplete`
- `pattern`, `min`, `max`, `maxLength`
- E todas as outras props nativas de `<input>`

## Como Lidar Com

### Validação de Formulário

**Com errorText:**
```tsx
<TextField 
  label="Email" 
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  errorText={errors.email}
  fullWidth 
/>
```

**Com helperText:**
```tsx
<TextField 
  label="Senha" 
  type="password"
  helperText="Mínimo 8 caracteres"
  fullWidth 
/>
```

### Type Email
```tsx
<TextField 
  label="Email" 
  type="email"
  autoComplete="email"
  fullWidth 
/>
```
HTML5 validação nativa funciona automaticamente com `type="email"`.

### Type Password
```tsx
<TextField 
  label="Senha" 
  type="password"
  autoComplete="new-password"
  fullWidth 
/>
```

### Required
```tsx
<TextField 
  label="Nome" 
  required
  fullWidth 
/>
```
Adiciona asterisco (*) vermelho no label.

## Exemplo Real (Signup.tsx)

```tsx
import { Stack } from "@mui/material";
import { TextField } from "../ui/TextField/TextField";

export default function Signup() {
  return (
    <Stack spacing={2}>
      <TextField label="Nome completo" fullWidth />
      <TextField label="Email" type="email" fullWidth />
      <TextField label="Senha" type="password" fullWidth />
      <TextField label="Confirmar senha" type="password" fullWidth />
    </Stack>
  );
}
```

**Resultado:**
- ✅ 4 campos alinhados verticalmente
- ✅ Espaçamento consistente (Stack spacing={2})
- ✅ Full width em todos
- ✅ Tokens de design aplicados automaticamente
- ✅ Zero customizações via sx/style

## Regras de Migração

### ✅ FAÇA

1. **Preserve o layout existente**
   ```tsx
   // Antes
   <Stack spacing={2}>
     <MuiTextField label="Nome" fullWidth />
   </Stack>
   
   // Depois - IGUAL
   <Stack spacing={2}>
     <TextField label="Nome" fullWidth />
   </Stack>
   ```

2. **Migre 1 campo por commit**
   ```bash
   git commit -m "feat(page): migra campo 'Nome' para TextField VE"
   ```

3. **Mantenha todas as props**
   ```tsx
   // Antes
   <MuiTextField 
     label="Email" 
     type="email"
     value={email}
     onChange={handleChange}
     required
     fullWidth 
   />
   
   // Depois - TODAS as props preservadas
   <TextField 
     label="Email" 
     type="email"
     value={email}
     onChange={handleChange}
     required
     fullWidth 
   />
   ```

### ❌ NÃO FAÇA

1. **Envolver em novos containers**
   ```tsx
   // ❌ ERRADO
   <Box>
     <TextField label="Nome" fullWidth />
   </Box>
   
   // ✅ CORRETO
   <TextField label="Nome" fullWidth />
   ```

2. **Alterar spacing/layout ao migrar**
   ```tsx
   // ❌ ERRADO - mudou spacing
   <Stack spacing={3}>
     <TextField label="Nome" fullWidth />
   </Stack>
   
   // ✅ CORRETO - manteve spacing={2}
   <Stack spacing={2}>
     <TextField label="Nome" fullWidth />
   </Stack>
   ```

3. **Adicionar customizações via sx/style**
   ```tsx
   // ❌ ERRADO
   <TextField 
     label="Nome" 
     fullWidth 
     style={{ marginTop: 8 }}
   />
   
   // ✅ CORRETO - use container
   <Box sx={{ mt: 1 }}>
     <TextField label="Nome" fullWidth />
   </Box>
   ```

4. **Migrar múltiplos campos no mesmo commit**
   ```bash
   # ❌ ERRADO
   git commit -m "migra todos os campos"
   
   # ✅ CORRETO - 1 campo = 1 commit
   git commit -m "feat(signup): migra campo 'Nome' para TextField VE"
   git commit -m "feat(signup): migra campo 'Email' para TextField VE"
   ```

## Tokens de Design

Todos os estilos usam tokens CSS do `designTokens.ts`:

- **Cores:** `--sc-input-text-color`, `--sc-input-label-color`, `--sc-input-placeholder-color`
- **Bordas:** `--sc-input-border-default`, `--sc-input-border-hover`, `--sc-input-border-focus`, `--sc-input-border-error`
- **Background:** `--sc-input-bg`
- **Espaçamento:** `--sc-input-padding-x`, `--sc-input-padding-y`
- **Bordas:** `--sc-input-radius`
- **Focus ring:** `--sc-input-focus-ring`
- **Erro:** `--sc-input-error-color`
- **Disabled:** `--sc-input-disabled-alpha`

## Referência Visual

**Página de referência:** `client/src/pages/Signup.tsx`

Esta página é o **exemplo canônico** de uso do TextField:
- Layout correto
- Props corretas
- Espaçamento correto
- Comportamento correto

Toda nova migração deve se comportar **exatamente igual** ao Signup.

## Checklist de Migração

Antes de commitar uma migração:

- [ ] Visual idêntico ao anterior?
- [ ] Digitação funciona?
- [ ] Validação/errorText preservados?
- [ ] Layout não mudou (spacing, containers)?
- [ ] TypeScript sem erros?
- [ ] Sem warnings no console?
- [ ] Apenas 1 campo migrado neste commit?
- [ ] Props nativas preservadas (autoComplete, required, etc.)?

## Troubleshooting

**Campo não full width?**
```tsx
// Adicione fullWidth explicitamente
<TextField label="Nome" fullWidth />
```

**Erro de TypeScript com onChange?**
```tsx
// Use o tipo correto do evento
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
```

**Validação não aparece?**
```tsx
// Use errorText, não error
<TextField 
  label="Email" 
  errorText={errors.email} // ✅ correto
  // error={errors.email}   // ❌ errado
  fullWidth 
/>
```

**Campo muito pequeno/grande?**
- Não customize altura via style/sx
- Use os tokens padrão (--sc-input-padding-y)
- Se realmente necessário, crie variant específica

---

**Última atualização:** Signup.tsx migração completa (4 campos)  
**Status:** ✅ Padrão validado e documentado
