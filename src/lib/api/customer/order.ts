import { apiClient } from "../client";

export interface Order {
  id: number;
  status: string;
  total_cents: number;
}

export const customerOrdersApi = {
  createDraft: async () => {
    const { data } = await apiClient.post<Order>("/customers/orders");
    return data;
  },
  addItem: async (orderId: number, productId: number, quantity: number) => {
    await apiClient.post(`/customers/orders/${orderId}/order_items`, {
      order_item: { product_id: productId, quantity },
    });
  },
  checkoutPickup: async (orderId: number) => {
    const { data } = await apiClient.post<Order>(
      `/customers/orders/${orderId}/checkout`,
      {
        order: { delivery_type: "pickup", payment_method: "pix" },
      },
    );
    return data;
  },
};
