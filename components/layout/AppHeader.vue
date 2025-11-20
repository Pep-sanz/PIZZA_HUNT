<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/store/useCartStore";

const route = useRoute();
const cartStore = useCartStore();

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
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
          :class="['nav-link', { active: route.path === link.to }]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <NuxtLink
        to="/cart"
        :class="['cart-link', { active: route.path === '/cart' }]"
      >
        <img src="assets/icons/cart.svg" style="width: 14px; height: 14px" />
        Cart
        <span v-if="totalItems > 0" class="cart-badge">
          {{ totalItems }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>
