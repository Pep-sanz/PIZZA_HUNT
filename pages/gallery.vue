<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMenuStore } from '@/store/useMenuStore';
import { useCartStore } from '@/store/useCartStore';

const menuStore = useMenuStore();
const cartStore = useCartStore();

const activeCategory = ref('All');
const selectedItem = ref<null | (typeof menuStore.pizzas[number])>(null);

const categories = computed(() => menuStore.categories);

const galleryItems = computed(() => {
  if (activeCategory.value === 'All') return menuStore.pizzas;
  return menuStore.pizzas.filter((item) => item.category === activeCategory.value);
});

const openModal = (item: typeof menuStore.pizzas[number]) => {
  selectedItem.value = item;
};

const closeModal = () => {
  selectedItem.value = null;
};

const addToCart = (item: typeof menuStore.pizzas[number]) => {
  cartStore.addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image
  });
  closeModal();
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
</script>

<template>
  <section class="hero" style="padding-top: 1rem; padding-bottom: 1rem;">
    <div class="hero-content">
      <h1>Feast with your eyes.</h1>
      <p>Browse our handcrafted pizzas in full glory. Tap a slice to learn more and add it to your cart.</p>
    </div>
  </section>

  <section class="filters">
    <div class="filter-row">
      <button
        v-for="category in categories"
        :key="category"
        class="btn btn--ghost"
        :class="{ active: activeCategory === category }"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>
  </section>

  <section>
    <div v-if="galleryItems.length === 0" class="empty-state">No pizzas in this category.</div>
    <div v-else class="gallery-grid">
      <BaseCard
        v-for="item in galleryItems"
        :key="item.id"
        hoverable
        @click="openModal(item)"
        style="cursor: pointer;"
      >
        <div class="card-media">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="card-body">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="badge">{{ item.category }}</div>
        </div>
      </BaseCard>
    </div>
  </section>

  <teleport to="body">
    <div v-if="selectedItem" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal" @click="closeModal">×</button>
        <div class="card-media">
          <img :src="selectedItem.image" :alt="selectedItem.name" />
        </div>
        <h2>{{ selectedItem.name }}</h2>
        <p>{{ selectedItem.description }}</p>
        <p class="badge" style="margin-bottom: 0.5rem;">{{ selectedItem.category }}</p>
        <p class="price">{{ formatPrice(selectedItem.price) }} · Ready in 20–25 minutes</p>
        <BaseButton variant="primary" @click="addToCart(selectedItem)">Add to Cart</BaseButton>
      </div>
    </div>
  </teleport>
</template>
