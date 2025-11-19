<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/useMenuStore';
import { useCartStore } from '@/store/useCartStore';

const router = useRouter();
const menuStore = useMenuStore();
const cartStore = useCartStore();

const menuSection = ref<HTMLElement | null>(null);

const pizzas = computed(() => menuStore.filteredItems);
const categories = computed(() => menuStore.categories);

const searchQuery = computed({
  get: () => menuStore.searchQuery,
  set: (val: string) => menuStore.setSearch(val)
});

const selectedCategory = computed({
  get: () => menuStore.selectedCategory,
  set: (val: string) => menuStore.setCategory(val)
});

const scrollToMenu = () => {
  if (menuSection.value) {
    menuSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const addToCart = (pizza: { id: number; name: string; price: number; image: string }) => {
  cartStore.addToCart(pizza);
};

const goToGallery = () => {
  router.push('/gallery');
};
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <p class="badge">Freshly baked pizza, just a click away.</p>
      <h1>pizzaHunt brings the oven-fresh goodness to your doorstep.</h1>
      <p>
        Discover artisan pizzas crafted with fresh ingredients, bold flavors, and a whole lot of love. Search, filter,
        and add your favorites to the cart in seconds.
      </p>
      <div class="hero-actions">
        <BaseButton variant="primary" @click="scrollToMenu">Order Now</BaseButton>
        <BaseButton variant="outline" @click="goToGallery">View Gallery</BaseButton>
      </div>
    </div>
    <div class="hero-image" aria-hidden="true">
      pizzaHunt kitchen vibes
    </div>
  </section>

  <section class="filters">
    <h2>Explore our menu</h2>
    <div class="filter-row">
      <BaseInput
        v-model="searchQuery"
        label="Search pizzas"
        placeholder="Search by name or ingredient"
      />

      <div class="form-field">
        <label class="form-label" for="category-select">Category</label>
        <select id="category-select" v-model="selectedCategory" class="select-field">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>
  </section>

  <section ref="menuSection">
    <div v-if="menuStore.loading" class="empty-state">Loading pizzas...</div>
    <div v-else>
      <div v-if="pizzas.length === 0" class="empty-state">No pizzas found. Try a different keyword.</div>
      <div v-else class="pizza-grid">
        <BaseCard
          v-for="pizza in pizzas"
          :key="pizza.id"
          hoverable
        >
          <div class="card-media">
            <img :src="pizza.image" :alt="pizza.name" />
          </div>
          <div class="card-body">
            <div class="badge">{{ pizza.category }}</div>
            <h3>{{ pizza.name }}</h3>
            <p>{{ pizza.description }}</p>
            <div class="card-footer">
              <span class="price">{{ formatPrice(pizza.price) }}</span>
              <BaseButton variant="primary" @click="addToCart(pizza)">Add to Cart</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </section>
</template>
