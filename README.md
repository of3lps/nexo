# Nexo - Community Platform

**Desenvolvido por Ana Flávia Almeida Matias e Luiz Felipe Almeida Matias**

Uma plataforma de comunidades construída com Next.js, Prisma e Supabase.

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Autenticação**: NextAuth.js

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Copie `.env.example` para `.env` e configure as variáveis
4. Execute as migrações: `npm run db:push`
5. Inicie o servidor: `npm run dev`

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run db:push` - Aplica mudanças no banco
- `npm run db:studio` - Abre o Prisma Studio