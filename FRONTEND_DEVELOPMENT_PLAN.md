# 🍣 SushiSpada Frontend - Plano de Desenvolvimento

## Visão Geral

Este documento apresenta o plano de desenvolvimento completo para o frontend do SushiSpada, um sistema de delivery de sushi. O backend é uma API Rails (API-only) com autenticação JWT, autorização via Pundit, e serialização com Blueprinter.

---

## 1. Stack Tecnológica

### Core (Já Configurado ✅)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 16.1.1 | Framework React com App Router, SSR/SSG |
| **React** | 19.2.3 | Biblioteca UI com Server Components |
| **TypeScript** | 5.x | Tipagem estática |
| **TailwindCSS** | 4.x | Framework CSS utility-first |
| **Biome** | 2.2.0 | Linter e formatter all-in-one |

### Bibliotecas Adicionais Recomendadas

| Biblioteca | Propósito | Justificativa |
|------------|-----------|---------------|
| **@tanstack/react-query** | Data fetching & cache | Cache inteligente, invalidação automática, estados de loading/error |
| **zustand** | Estado global leve | Simples, sem boilerplate, performático para cart/auth |
| **react-hook-form** | Formulários | Mínimo re-render, excelente DX com validação |
| **zod** | Validação de schemas | Inferência TypeScript, validação client/server |
| **lucide-react** | Ícones | Leve, tree-shakeable, modernos |
| **sonner** | Toasts/Notificações | API simples, bonito por padrão |
| **framer-motion** | Animações | Micro-interações para UX premium |
| **axios** | HTTP client | Interceptors para JWT, melhor que fetch nativo |
| **date-fns** | Datas | Imutável, tree-shakeable |
| **nuqs** | URL state | Sincroniza filtros com URL (SEO-friendly) |

---

## 2. Arquitetura de Pastas Proposta

```
src/
├── app/                          # App Router (Next.js 16)
│   ├── (auth)/                   # Grupo de rotas públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (customer)/               # Área do cliente
│   │   ├── layout.tsx            # Layout com navbar do cliente
│   │   ├── page.tsx              # Home/Cardápio
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx          # Lista de pedidos
│   │   │   └── [id]/page.tsx     # Detalhes do pedido
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── addresses/page.tsx
│   │
│   ├── admin/                    # Área administrativa
│   │   ├── layout.tsx            # Layout com sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   │
│   ├── api/                      # Route Handlers (se necessário)
│   │   └── health/route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # Componentes base reutilizáveis
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   └── table.tsx
│   │
│   ├── forms/                    # Formulários reutilizáveis
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── address-form.tsx
│   │   └── product-form.tsx
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-nav.tsx
│   │
│   ├── cart/                     # Componentes do carrinho
│   │   ├── cart-item.tsx
│   │   ├── cart-summary.tsx
│   │   └── cart-sheet.tsx
│   │
│   ├── products/                 # Componentes de produtos
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-filters.tsx
│   │   └── category-tabs.tsx
│   │
│   └── orders/                   # Componentes de pedidos
│       ├── order-card.tsx
│       ├── order-status-badge.tsx
│       └── order-timeline.tsx
│
├── lib/
│   ├── api/                      # Camada de API
│   │   ├── client.ts             # Config axios + interceptors
│   │   ├── auth.ts               # Endpoints de auth
│   │   ├── categories.ts         # CRUD categorias
│   │   ├── products.ts           # CRUD produtos
│   │   ├── orders.ts             # Operações de pedidos
│   │   └── addresses.ts          # CRUD endereços
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-cart.ts
│   │   ├── use-categories.ts
│   │   ├── use-products.ts
│   │   └── use-orders.ts
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── auth-store.ts
│   │   └── cart-store.ts
│   │
│   ├── schemas/                  # Schemas Zod (fonte única de tipos)
│   │   ├── auth.ts               # login, register, user schemas
│   │   ├── category.ts           # category schema
│   │   ├── product.ts            # product schema
│   │   ├── order.ts              # order, orderItem schemas
│   │   ├── address.ts            # address schema
│   │   └── index.ts              # Re-exporta todos schemas e tipos
│   │
│   ├── utils/                    # Utilitários
│   │   ├── cn.ts                 # Tailwind class merge
│   │   └── format.ts             # Formatadores (moeda, data)
│   │
│   └── providers/                # Context providers
│       ├── query-provider.tsx
│       └── auth-provider.tsx
│
└── config/
    ├── site.ts                   # Metadados do site
    └── navigation.ts             # Links de navegação
```

---

## 3. Padrões de Arquitetura

### 3.1 Data Fetching Pattern

```tsx
// lib/api/products.ts - Camada de API
export const productsApi = {
  list: (params?: ProductsParams) => 
    apiClient.get<Product[]>('/customers/products', { params }),
  
  getById: (id: string) => 
    apiClient.get<Product>(`/customers/products/${id}`),
};

// lib/hooks/use-products.ts - React Query hook
export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
  });
}

// components/products/product-grid.tsx - Componente
'use client';
export function ProductGrid() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <ProductGridSkeleton />;
  return <div>{products?.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}
```

### 3.2 Estado Global (Zustand)

```tsx
// lib/stores/auth-store.ts - Apenas controle de estado do usuário
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// lib/stores/cart-store.ts
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => { ... },
      // ...
    }),
    { name: 'sushispada-cart' }
  )
);
```

### 3.3 Schemas e Tipos (Schema-First)

> [!TIP]
> Usamos a abordagem **schema-first**: tipos TypeScript são **inferidos** dos schemas Zod. Isso garante uma única fonte de verdade.

**Estrutura do diretório `lib/schemas/`:**

```tsx
// lib/schemas/auth.ts
import { z } from 'zod';

// ============================================
// SCHEMAS DE FORMULÁRIO
// ============================================
export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Senhas não conferem',
  path: ['password_confirmation'],
});

// ============================================
// SCHEMAS DE RESPOSTA DA API
// ============================================
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'admin']),
  created_at: z.string().datetime(),
});

// ============================================
// TIPOS INFERIDOS (única fonte de verdade)
// ============================================
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type User = z.infer<typeof userSchema>;
```

**Uso em formulários com react-hook-form:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/schemas/auth';

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
    // data já está validado e tipado!
    await authApi.login(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

**Uso em componentes:**

```tsx
import { Product } from '@/lib/schemas/product';

function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}
```

---

### 3.4 Autenticação com HttpOnly Cookies

> [!NOTE]
> O backend usa **httponly cookies** para autenticação, o que é mais seguro pois o token não fica acessível via JavaScript (proteção contra XSS).

```tsx
// lib/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⚠️ CRUCIAL: envia cookies automaticamente
});

// Apenas interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie expirou ou inválido
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Simplificações com httponly cookies:**
- ❌ Não precisa armazenar token em localStorage/Zustand
- ❌ Não precisa interceptar requests para adicionar header Authorization
- ✅ `withCredentials: true` faz tudo automaticamente
- ✅ Mais seguro contra ataques XSS

**Configuração CORS necessária no backend:**
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000' # URL do frontend
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete],
      credentials: true # ⚠️ Essencial para cookies
  end
end
```

---

## 4. Páginas e Funcionalidades

### 4.1 Área Pública/Cliente

| Página | Rota | Descrição |
|--------|------|-----------|
| **Login** | `/login` | Autenticação com email/senha |
| **Registro** | `/register` | Cadastro de novo cliente |
| **Cardápio** | `/` | Grid de produtos com filtros por categoria |
| **Carrinho** | `/cart` | Lista de itens, quantidades, subtotais |
| **Checkout** | `/checkout` | Seleção de endereço, cupom, confirmação |
| **Meus Pedidos** | `/orders` | Histórico de pedidos do cliente |
| **Detalhes Pedido** | `/orders/[id]` | Timeline de status, itens do pedido |
| **Perfil** | `/profile` | Dados do usuário |
| **Endereços** | `/profile/addresses` | CRUD de endereços |

### 4.2 Área Administrativa

| Página | Rota | Descrição |
|--------|------|-----------|
| **Dashboard** | `/admin` | Métricas, pedidos recentes |
| **Categorias** | `/admin/categories` | CRUD de categorias |
| **Produtos** | `/admin/products` | CRUD de produtos |
| **Pedidos** | `/admin/orders` | Gerenciamento de todos pedidos |

---

## 5. Roadmap de Desenvolvimento

### Sprint 1 - Fundação (1 semana)

- [ ] Setup de dependências adicionais
- [ ] Configurar estrutura de pastas
- [ ] Criar componentes UI base (button, input, card, etc.)
- [ ] Configurar Axios com interceptors JWT
- [ ] Criar `auth-store` e `cart-store` (Zustand)
- [ ] Setup React Query Provider
- [ ] Criar layout base (header, footer)

### Sprint 2 - Autenticação + Cardápio (1 semana)

- [ ] Páginas de Login e Registro
- [ ] Integração com `/auth/sign_in` e `/auth/sign_up`
- [ ] Proteção de rotas (middleware Next.js)
- [ ] Página de cardápio com produtos
- [ ] Filtros por categoria
- [ ] Componente ProductCard com botão "Adicionar"

### Sprint 3 - Carrinho + Checkout (1 semana)

- [ ] Sheet lateral do carrinho
- [ ] Página do carrinho com edição de quantidades
- [ ] Página de checkout
- [ ] Integração com criação de draft order
- [ ] Seleção/cadastro de endereço
- [ ] Finalização do pedido (checkout)

### Sprint 4 - Pedidos + Admin Básico (1 semana)

- [ ] Listagem de pedidos do cliente
- [ ] Detalhes do pedido com status
- [ ] Layout admin com sidebar
- [ ] CRUD de categorias (admin)
- [ ] CRUD de produtos (admin)
- [ ] Listagem de pedidos (admin)

---

## 6. Considerações Importantes

### 6.1 Regras de Negócio do Backend

> [!IMPORTANT]
> O frontend deve respeitar as regras implementadas no backend:

1. **Preço Congelado**: O frontend não precisa se preocupar com cálculos complexos - o backend já salva o `unit_price_cents` no momento da criação do item.

2. **Estado Draft**: Pedidos só podem ser alterados enquanto em `draft`. O frontend deve desabilitar edições para pedidos em outros estados.

3. **Snapshot de Endereço**: Ao exibir detalhes de um pedido finalizado, usar os campos `delivery_*` do pedido, não o endereço atual do usuário.

### 6.2 Tratamento de Valores Monetários

```tsx
// lib/utils/format.ts
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}
```

### 6.3 Testes Recomendados

| Ferramenta | Uso |
|------------|-----|
| **Vitest** | Testes unitários de utils/hooks |
| **Testing Library** | Testes de componentes |
| **Playwright** | Testes E2E dos fluxos principais |

---

## 7. Próximos Passos Imediatos

Após aprovação deste plano:

1. **Instalar dependências** recomendadas
2. **Criar estrutura base** de pastas e arquivos
3. **Implementar design system** com componentes UI
4. **Configurar autenticação** e interceptors

---

> [!TIP]
> Este plano segue as melhores práticas do ecossistema Next.js/React moderno e está alinhado com a arquitetura de serviços do backend Rails.
