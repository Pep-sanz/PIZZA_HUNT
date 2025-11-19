<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/useCartStore';

const cartStore = useCartStore();
const router = useRouter();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const tax = computed(() => cartStore.tax);
const deliveryFee = computed(() => cartStore.deliveryFee);
const grandTotal = computed(() => cartStore.grandTotal);

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const goHome = () => router.push('/');
</script>

<template>
  <section>
    <header class="mb-3">
      <h1>Your Cart</h1>
      <p>Review and adjust your selections before checkout.</p>
    </header>

    <div v-if="items.length === 0" class="empty-state">
      <p>Your cart is empty. Start hunting for pizzas!</p>
      <BaseButton variant="primary" @click="goHome">Back to Home</BaseButton>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="cart-thumb" />
          <div class="cart-info">
            <h4>{{ item.name }}</h4>
            <p class="cart-price">{{ formatPrice(item.price) }} each</p>
            <div class="qty-controls">
              <button class="qty-btn" aria-label="Decrease quantity" @click="cartStore.decreaseQty(item.id)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" aria-label="Increase quantity" @click="cartStore.increaseQty(item.id)">+</button>
            </div>
          </div>
          <div class="cart-actions" style="text-align: right;">
            <p class="price">{{ formatPrice(item.price * item.quantity) }}</p>
            <button class="btn btn--ghost" @click="cartStore.removeItem(item.id)">Remove</button>
          </div>
        </div>
      </div>

      <aside class="summary">
        <h3>Order Summary</h3>
        <div class="summary-row muted">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="summary-row muted">
          <span>Tax (10%)</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        <div class="summary-row muted">
          <span>Delivery</span>
          <span>{{ formatPrice(deliveryFee) }}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total</span>
          <span>{{ formatPrice(grandTotal) }}</span>
        </div>
        <BaseButton variant="primary" fullWidth @click="router.push('/checkout')">
          Proceed to Checkout
        </BaseButton>
      </aside>
    </div>
  </section>
</template>
