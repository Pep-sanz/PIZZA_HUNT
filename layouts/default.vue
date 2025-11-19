<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="layout-shell">
    <AppHeader />

    <main class="layout-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
