<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMenuStore, type PizzaItem } from "@/store/useMenuStore";
import { useCartStore } from "@/store/useCartStore";
import PizzaCard from "~/components/menu/PizzaCard.vue";

const router = useRouter();
const menuStore = useMenuStore();
const cartStore = useCartStore();
await useAsyncData("pizzas", () => menuStore.fetchPizzas());

const menuSection = ref<HTMLElement | null>(null);

const pizzas = computed(() => menuStore.filteredItems);
const categories = computed(() => menuStore.categories);

const searchQuery = computed({
  get: () => menuStore.searchQuery,
  set: (val: string) => menuStore.setSearchQuery(val),
});

const selectedCategory = computed({
  get: () => menuStore.selectedCategory,
  set: (val: string) => menuStore.setCategory(val),
});

const scrollToMenu = () => {
  if (menuSection.value) {
    menuSection.value.scrollIntoView({ behavior: "smooth" });
  }
};

const addToCart = (pizza: PizzaItem) => {
  cartStore.addToCart({
    id: pizza.id,
    name: pizza.title,
    price: pizza.price,
    image: pizza.image,
  });
};

const goToMenu = () => {
  router.push("/menu");
};
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <p class="badge">Freshly baked pizza, just a click away.</p>
      <h1>pizzaHunt brings the oven-fresh goodness to your doorstep.</h1>
      <p>
        Discover artisan pizzas crafted with fresh ingredients, bold flavors,
        and a whole lot of love. Search, filter, and add your favorites to the
        cart in seconds.
      </p>
      <div class="hero-actions">
        <BaseButton variant="primary" @click="scrollToMenu"
          >Order Now</BaseButton
        >
        <BaseButton variant="outline" @click="goToMenu">View Menu</BaseButton>
      </div>
    </div>
    <!-- <div class="hero-image" aria-hidden="true">pizzaHunt kitchen vibes</div> -->
    <img
      src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80"
      alt="Pizza Image"
    />
  </section>

  <section class="filters">
    <h2>Popular menu</h2>
    <div class="filter-row">
      <BaseInput
        v-model="searchQuery"
        label="Search pizzas"
        placeholder="Search by name or ingredient"
      />

      <div class="form-field">
        <label class="form-label" for="category-select">Category</label>
        <select
          id="category-select"
          v-model="selectedCategory"
          class="select-field"
        >
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>
  </section>

  <section ref="menuSection">
    <div v-if="menuStore.loading" class="empty-state">Loading pizzas...</div>
    <div v-else-if="menuStore.error" class="empty-state">
      {{ menuStore.error }}
    </div>
    <div v-else>
      <div v-if="pizzas.length === 0" class="empty-state">
        No pizzas found. Try a different keyword.
      </div>
      <div v-else class="pizza-grid">
        <PizzaCard
          v-for="pizza in pizzas"
          :key="pizza.id"
          :pizza="pizza"
          @add="addToCart"
        />
      </div>
    </div>
  </section>
</template>
