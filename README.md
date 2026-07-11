# Sushispada Frontend

Interface Next.js do Sushispada, uma aplicação full-stack de delivery japonês. Inclui autenticação, cardápio responsivo, carrinho, checkout para retirada e painel administrativo de produtos.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query, Zod e React Hook Form.

## Executando

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Verificações: `npm run lint` e `npm run build`.

A aplicação abre em `http://localhost:3001` e espera a API Rails configurada em `NEXT_PUBLIC_API_URL`.

Credenciais após executar os seeds da API:

- `admin@sushispada.dev` / `sushispada123`
- `cliente@sushispada.dev` / `sushispada123`
