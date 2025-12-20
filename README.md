# Superclient

Aplicacao web para autenticacao, pipeline, financas e gestao de acessos.

## Requisitos
- Node.js 18+ (ou superior)
- pnpm

## Como rodar
```bash
pnpm install
pnpm server:dev
pnpm dev
```

## Enderecos
- Frontend: http://localhost:3000
- API: http://localhost:3001

## Variaveis de ambiente (opcional)
- `VITE_API_PROXY_TARGET` (default: http://localhost:3001)
- `VITE_API_URL` (usado em build)

## Estrutura
- `client/` frontend (Vite + React + MUI)
- `server/` API (Express + SQLite)
- `shared/` tipos e utilitarios

## Funcionalidades
- Login, cadastro e recuperacao de senha
- Pipeline com colunas e cards
- Dados do pipeline com metricas
- Financas com categorias e gastos
- Gestao de acessos e convites

