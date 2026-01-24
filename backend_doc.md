# 1) Estrutura do repositório Rails (API-first)

Pensado para:
- Rails **API only**
- Controllers finos
- Regras de negócio fora dos controllers
- Autorização clara (cliente x admin)

```
app/
├── controllers/
│   ├── application_controller.rb
│   ├── auth/
│   │   ├── registrations_controller.rb
│   │   └── sessions_controller.rb
│   ├── customers/
│   │   ├── addresses_controller.rb
│   │   ├── categories_controller.rb
│   │   ├── order_items_controller.rb
│   │   ├── orders_controller.rb
│   │   └── products_controller.rb
│   └── admin/
│       ├── categories_controller.rb
│       ├── orders_controller.rb
│       └── products_controller.rb
│
├── models/
│   ├── user.rb
│   ├── category.rb
│   ├── product.rb
│   ├── address.rb
│   ├── delivery_zone.rb
│   ├── order.rb
│   ├── order_item.rb
│   ├── coupon.rb
│   └── order_coupon.rb
│
├── services/
│   ├── auth/
│   │   └── jwt_service.rb
│   └── orders/
│       ├── add_item.rb
│       ├── checkout.rb
│       ├── find_or_create_draft.rb
│       ├── remove_item.rb
│       └── update_item.rb
│
├── queries/
│   ├── orders_query.rb
│   └── products_query.rb
│
├── policies/                # Pundit
│   ├── application_policy.rb
│   ├── address_policy.rb
│   ├── category_policy.rb
│   ├── order_item_policy.rb
│   ├── order_policy.rb
│   └── product_policy.rb
│
├── serializers/             # Blueprinter
│   ├── category_serializer.rb
│   ├── order_item_serializer.rb
│   ├── order_serializer.rb
│   ├── product_serializer.rb
│   └── user_serializer.rb
│
└── jobs/                    # ActiveJob
    └── application_job.rb
```

---

## Gems Utilizadas

```ruby
# Auth & Security
gem 'bcrypt'
gem 'jwt'
gem 'pundit'

# Data & Serialization
gem 'blueprinter'
gem 'kaminari' (paginação)

# Utils
gem 'dotenv-rails'
```

---

# 2) Padrões importantes (decisões de arquitetura)

### Controllers
- Apenas: validar params, autorizar, chamar service/query e renderizar resposta.
- ❌ Nada de regra de negócio em controller.

### Services
- Localizados em `app/services/`.
- Um service = **uma ação clara** (ex: `Orders::Checkout`).
- Utilizam transações de banco quando necessário.

### Queries
- Localizadas em `app/queries/`.
- Encapsulam lógica de busca, filtros e ordenação complexa.

---

# 3) Rotas Atuais (API)

- `POST /auth/sign_up` | `POST /auth/sign_in`
- **Customers**:
  - `GET /customers/categories`
  - `GET /customers/products`
  - `GET /customers/addresses`
  - `POST /customers/orders` (Cria draft)
  - `POST /customers/orders/:id/checkout`
- **Admin**:
  - CRUD de `categories`, `products`.
  - Gerenciamento de `orders`.

---

# 4) Regras de Negócio Implementadas (MVP)

1.  **Preço Congelado**: O `OrderItem` salva `unit_price_cents` no momento da criação para evitar que mudanças futuras no preço do produto afetem pedidos antigos.
2.  **Snapshot de Endereço**: No checkout, os dados do endereço são copiados para campos `delivery_...` na tabela `orders`. Isso garante o histórico caso o usuário mude de endereço depois.
3.  **Estado Draft**: Pedidos novos nascem como `draft` e só aceitam itens ou alterações enquanto estiverem nesse estado.
4.  **Cálculo Automático**: `Order#recalculate_totals!` soma itens, adiciona taxa de entrega e subtrai descontos.

---

# 5) Próximos Passos (Prioridades)

1.  **Cupons**: Implementar a aplicação de cupons no service de `Checkout` (atualmente a tabela existe mas o service não a utiliza).
2.  **Taxas de Entrega**: Integrar a `DeliveryZone` de forma dinâmica no checkout baseado no bairro do endereço.
3.  **Ambiente de Testes**: Configurar RSpec e FactoryBot para iniciar a cobertura de testes.
4.  **Admin UI/Endpoints**: Finalizar endpoints de `DeliveryZones` e `Coupons`.
