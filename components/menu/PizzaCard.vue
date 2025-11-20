<script setup lang="ts">
import { computed } from "vue";
import type { PizzaItem } from "@/store/useMenuStore";
import { collapseText } from "@/utils/text";

const props = withDefaults(
  defineProps<{
    pizza: PizzaItem;
    selectable?: boolean;
    showAction?: boolean;
  }>(),
  {
    selectable: false,
    showAction: true,
  }
);

const emit = defineEmits<{
  (e: "add", pizza: PizzaItem): void;
  (e: "select", pizza: PizzaItem): void;
}>();

const formattedPrice = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(props.pizza.price)
);

const description = computed(() => collapseText(props.pizza.description, 55));
const title = computed(() => collapseText(props.pizza.title, 25));

const handleAdd = () => {
  emit("add", props.pizza);
};

const handleSelect = () => {
  if (!props.selectable) return;
  emit("select", props.pizza);
};
</script>

<template>
  <BaseCard
    hoverable
    @click="handleSelect"
    :class="{ 'is-selectable': props.selectable }"
  >
    <div class="card-media">
      <img :src="props.pizza.image" :alt="props.pizza.title" />
    </div>
    <div class="card-body">
      <div class="badge">{{ props.pizza.category }}</div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <div class="card-footer">
        <span class="price">{{ formattedPrice }}</span>
        <BaseButton
          v-if="props.showAction"
          variant="primary"
          @click.stop="handleAdd"
        >
          Add to Cart
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
