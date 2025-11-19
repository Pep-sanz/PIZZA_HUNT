<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/store/useCartStore';

const route = useRoute();
const cartStore = useCartStore();

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/cart', label: 'Cart' },
  { to: '/checkout', label: 'Checkout' }
];

const totalItems = computed(() => cartStore.totalItems);
</script>

<template>
  <header class="app-header">
    <div class="container inner">
      <NuxtLink to="/" class="brand">
        <span aria-hidden="true">🍕</span>
        pizzaHunt
        <span class="sr-only">Freshly baked pizza, just a click away.</span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ active: route.path === link.to, 'cart-link': link.to === '/cart' }"
        >
          <template v-if="link.to === '/cart'">
            <span aria-hidden="true">🛒</span>
            Cart
            <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
          </template>
          <template v-else>
            {{ link.label }}
          </template>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
