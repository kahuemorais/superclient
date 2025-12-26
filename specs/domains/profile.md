# Profile Domain

## Contexto

O módulo de perfil permite ao usuário gerenciar suas informações pessoais, preferências e configurações de conta.

## Objetivo

Prover visualização e edição de dados do perfil do usuário.

## Fora de Escopo

- ❌ Alterações de UI, layout ou estilos
- ❌ Novos campos visuais
- ❌ Mudanças em componentes de formulário

## Fluxo do Usuário

### Visualizar Perfil
1. Usuário acessa /perfil
2. Sistema carrega dados do usuário
3. Sistema exibe formulário preenchido

### Editar Perfil
1. Usuário modifica campos
2. Sistema valida em tempo real
3. Usuário clica em salvar
4. Sistema persiste alterações

### Alterar Senha
1. Usuário preenche senha atual
2. Usuário preenche nova senha
3. Sistema valida requisitos
4. Sistema atualiza senha

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN01 | Nome é obrigatório |
| RN02 | Email não pode ser alterado |
| RN03 | Senha mínimo 8 caracteres |
| RN04 | Senha atual obrigatória para trocar |
| RN05 | Fuso horário afeta exibição de datas |

## Estados Possíveis

```typescript
type ProfileState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; profile: Profile }
  | { status: 'saving' }
  | { status: 'error'; error: string };
```

## Modelo de Dados

```typescript
interface Profile {
  id: string;
  name: string;
  email: string; // readonly
  team?: string;
  role?: string;
  timezone: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileUpdate {
  name?: string;
  team?: string;
  role?: string;
  timezone?: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}
```

## Contrato de API

### GET /api/profile
```typescript
// Response 200
{
  "profile": Profile
}
```

### PUT /api/profile
```typescript
// Request
{
  "name"?: string,
  "team"?: string,
  "timezone"?: string
}

// Response 200
{
  "profile": Profile
}

// Response 400
{
  "error": "validation_error",
  "fields": { "name": "required" }
}
```

### POST /api/profile/password
```typescript
// Request
{
  "currentPassword": string,
  "newPassword": string
}

// Response 200
{
  "success": true
}

// Response 400
{
  "error": "invalid_password"
}
```

## Erros e Edge Cases

| Cenário | Comportamento |
|---------|---------------|
| Senha atual incorreta | Erro específico |
| Nome vazio | Erro de validação |
| Sessão expirada | Redirect para login |

## Critérios de Aceitação

- [ ] `GIVEN` perfil carregado `WHEN` alterar nome `THEN` botão salvar habilitado
- [ ] `GIVEN` nome alterado `WHEN` salvar `THEN` nome persiste
- [ ] `GIVEN` senha atual errada `WHEN` trocar senha `THEN` erro exibido
- [ ] `GIVEN` nova senha < 8 chars `WHEN` salvar `THEN` erro de validação
