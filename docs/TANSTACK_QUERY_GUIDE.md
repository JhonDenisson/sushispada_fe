# Guia de Implementação - TanStack Query + Axios

## 1. Instalação

```bash
npm install @tanstack/react-query axios
```

---

## 2. Criar Cliente Axios

```tsx
// src/lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Envia cookies httponly automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de resposta para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie expirou - redireciona para login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 3. Criar Query Provider

```tsx
// src/lib/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 4. Configurar no Root Layout

```tsx
// src/app/layout.tsx
import { QueryProvider } from '@/lib/providers/query-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

---

## 5. Criar Camada de API

```tsx
// src/lib/api/products.ts
import { apiClient } from './client';
import { Product } from '@/lib/schemas/product';

export const productsApi = {
  list: async (categoryId?: number) => {
    const { data } = await apiClient.get<Product[]>('/customers/products', {
      params: categoryId ? { category_id: categoryId } : undefined,
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Product>(`/customers/products/${id}`);
    return data;
  },
};
```

---

## 6. Criar Hooks com React Query

```tsx
// src/lib/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

// Query Keys centralizadas
export const productKeys = {
  all: ['products'] as const,
  list: (categoryId?: number) => [...productKeys.all, 'list', categoryId] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

// Hook para listar produtos
export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: productKeys.list(categoryId),
    queryFn: () => productsApi.list(categoryId),
  });
}

// Hook para produto específico
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id, // Só executa se id existir
  });
}
```

---

## 7. Usar nos Componentes

```tsx
// src/components/products/product-grid.tsx
'use client';

import { useProducts } from '@/lib/hooks/use-products';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductGrid({ categoryId }: { categoryId?: number }) {
  const { data: products, isLoading, error } = useProducts(categoryId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar produtos</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 8. Mutations (POST/PUT/DELETE)

```tsx
// src/lib/hooks/use-cart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { product_id: number; quantity: number }) => {
      const { data: response } = await apiClient.post('/customers/order_items', data);
      return response;
    },
    onSuccess: () => {
      toast.success('Produto adicionado ao carrinho!');
      // Invalida cache do carrinho para refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Erro ao adicionar produto');
    },
  });
}

// Uso no componente:
function AddToCartButton({ productId }: { productId: number }) {
  const addToCart = useAddToCart();

  return (
    <button
      onClick={() => addToCart.mutate({ product_id: productId, quantity: 1 })}
      disabled={addToCart.isPending}
    >
      {addToCart.isPending ? 'Adicionando...' : 'Adicionar'}
    </button>
  );
}
```

---

## Estrutura Final de Arquivos

```
src/lib/
├── api/
│   ├── client.ts          # Axios configurado
│   ├── auth.ts            # Endpoints de auth
│   ├── products.ts        # Endpoints de produtos
│   ├── categories.ts      # Endpoints de categorias
│   └── orders.ts          # Endpoints de pedidos
│
├── hooks/
│   ├── use-auth.ts        # useLogin, useRegister, useCurrentUser
│   ├── use-products.ts    # useProducts, useProduct
│   ├── use-categories.ts  # useCategories
│   ├── use-cart.ts        # useCart, useAddToCart, useRemoveFromCart
│   └── use-orders.ts      # useOrders, useOrder, useCheckout
│
└── providers/
    └── query-provider.tsx # Provider do React Query
```

---

## Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Próximos Passos

1. Instale as dependências: `npm install @tanstack/react-query axios`
2. Crie os arquivos na ordem: client.ts → query-provider.tsx → layout.tsx
3. Implemente uma API e hook de exemplo (ex: products)
4. Teste com um componente simples
