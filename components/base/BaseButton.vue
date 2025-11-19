<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'ghost';
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
  }>(),
  {
    variant: 'primary',
    type: 'button',
    fullWidth: false
  }
);

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  {
    'btn--full': props.fullWidth
  }
]);
</script>

<template>
  <button :type="props.type" :class="classes">
    <slot />
  </button>
</template>
