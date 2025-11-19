import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart-store', {
  state: () => ({
    items: [] as Array<{
      id: number;
      name: string;
      price: number;
      image: string;
      quantity: number;
    }>
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    tax(): number {
      return this.subtotal * 0.1;
    },
    deliveryFee: () => 15000,
    grandTotal(): number {
      return this.subtotal + this.tax + this.deliveryFee;
    }
  },
  actions: {
    addToCart(payload: { id: number; name: string; price: number; image: string }) {
      const existing = this.items.find((item) => item.id === payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push({ ...payload, quantity: 1 });
      }
    },
    increaseQty(id: number) {
      const item = this.items.find((entry) => entry.id === id);
      if (item) item.quantity += 1;
    },
    decreaseQty(id: number) {
      const item = this.items.find((entry) => entry.id === id);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItem(id);
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter((entry) => entry.id !== id);
    },
    clearCart() {
      this.items = [];
    }
  }
});
