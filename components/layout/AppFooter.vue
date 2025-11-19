<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <p>© {{ currentYear }} pizzaHunt. All rights reserved.</p>
      <small>Served with fresh code and hot pizza.</small>
    </div>
  </footer>
</template>
