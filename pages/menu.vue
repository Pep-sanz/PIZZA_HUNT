<script setup lang="ts">
import { computed, ref } from "vue";
import { useMenuStore, type PizzaItem } from "@/store/useMenuStore";
import { useCartStore } from "@/store/useCartStore";
import PizzaCard from "~/components/menu/PizzaCard.vue";

const menuStore = useMenuStore();
const cartStore = useCartStore();
await useAsyncData("pizzas-gallery", async () => {
  if (!menuStore.items.length) {
    return await menuStore.fetchPizzas();
  }
  return menuStore.items;
});

const activeCategory = ref("All");
const searchTerm = ref("");
const selectedItem = ref<null | PizzaItem>(null);

const categories = computed(() => menuStore.categories);

const galleryItems = computed(() => {
  const query = searchTerm.value.trim().toLowerCase();
  return menuStore.items.filter((item) => {
    const matchesCategory =
      activeCategory.value === "All" || item.category === activeCategory.value;
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
});

const openModal = (item: PizzaItem) => {
  selectedItem.value = item;
};

const closeModal = () => {
  selectedItem.value = null;
};

const addToCart = (item: PizzaItem) => {
  cartStore.addToCart({
    id: item.id,
    name: item.title,
    price: item.price,
    image: item.image,
  });
  closeModal();
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
</script>

<template>
  <section class="hero" style="padding-top: 1rem; padding-bottom: 1rem">
    <div class="hero-content">
      <h1>Feast with your eyes.</h1>
      <p>
        Browse our handcrafted pizzas in full glory. Tap a slice to learn more
        and add it to your cart.
      </p>
    </div>
  </section>

  <section class="filters">
    <BaseInput
      v-model="searchTerm"
      label="Search pizzas"
      placeholder="Search by name or ingredient"
    />
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
    <div v-if="menuStore.loading" class="empty-state">Loading pizzas...</div>
    <div v-else-if="menuStore.error" class="empty-state">
      {{ menuStore.error }}
    </div>
    <div v-else-if="galleryItems.length === 0" class="empty-state">
      No pizzas match your filters. Try a different search.
    </div>
    <div v-else class="gallery-grid">
      <PizzaCard
        v-for="item in galleryItems"
        :key="item.id"
        :pizza="item"
        selectable
        :show-action="false"
        @select="openModal"
      />
    </div>
  </section>

  <teleport to="body">
    <div v-if="selectedItem" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content">
        <button
          class="modal-close"
          aria-label="Close modal"
          @click="closeModal"
        >
          ×
        </button>
        <div class="card-media">
          <img :src="selectedItem.image" :alt="selectedItem.title" />
        </div>
        <h2>{{ selectedItem.title }}</h2>
        <p>{{ selectedItem.description }}</p>
        <p class="badge" style="margin-bottom: 0.5rem">
          {{ selectedItem.category }}
        </p>
        <p class="price">
          {{ formatPrice(selectedItem.price) }} · Ready in
          {{ selectedItem.readyInMinutes || 20 }} minutes
        </p>
        <BaseButton variant="primary" @click="addToCart(selectedItem)"
          >Add to Cart</BaseButton
        >
      </div>
    </div>
  </teleport>
</template>
