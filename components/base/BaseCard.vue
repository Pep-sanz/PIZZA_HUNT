<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    hoverable?: boolean;
  }>(),
  {
    hoverable: false
  }
);
</script>

<template>
  <div class="base-card" :class="{ hoverable: props.hoverable }">
    <slot />
  </div>
</template>
