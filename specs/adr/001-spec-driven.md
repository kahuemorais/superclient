# ADR 001: Spec Driven Development

## Status

Aceito

## Data

2025-12-26

## Contexto

O desenvolvimento do Superclient estava sendo feito de forma ad-hoc, com mudanças de UI e lógica misturadas. Isso causava:

1. **Retrabalho constante** - Mudanças de UI quebravam lógica e vice-versa
2. **Dificuldade de teste** - Código acoplado difícil de testar isoladamente
3. **Falta de documentação** - Comportamentos esperados não documentados
4. **Commits grandes** - PRs misturando várias preocupações

## Decisão

Adotar **Spec Driven Development** com as seguintes regras:

### 1. UI Congelada
- A UI em MUI está congelada
- Nenhuma mudança visual permitida
- UI só recebe wiring de props, handlers e estados

### 2. Spec First
- Toda feature começa com uma spec
- Spec define comportamento antes do código
- Template obrigatório com todos os campos

### 3. Vertical Slices
- Desenvolvimento por fatias verticais
- Cada slice inclui: spec → types → api → state → tests → wiring
- Um PR por slice

### 4. Separação de Domínios
- Código organizado por domínio (contacts, notes, etc.)
- Cada domínio tem seus tipos, validações e API
- Domínios não dependem uns dos outros diretamente

## Consequências

### Positivas
- Features evoluem sem tocar UI
- Código previsível e testável
- Documentação sempre atualizada
- PRs pequenos e focados
- Testes isolados possíveis

### Negativas
- Overhead inicial de documentação
- Curva de aprendizado para o time
- Pode parecer lento no início

### Neutras
- Mudança de mindset necessária
- Requer disciplina para manter

## Alternativas Consideradas

### 1. Continuar ad-hoc
Rejeitado por causar os problemas listados no contexto.

### 2. TDD puro
Parcialmente adotado. Specs complementam com visão de alto nível que testes unitários não capturam.

### 3. BDD com Cucumber
Muito overhead. Specs em Markdown mais simples e flexíveis.

## Implementação

1. Criar estrutura `/specs` ✅
2. Documentar domínios existentes ✅
3. Definir vertical slices ✅
4. Começar desenvolvimento por slice
5. Revisar e ajustar processo

## Revisão

Este ADR será revisado após 3 sprints para avaliar efetividade.
