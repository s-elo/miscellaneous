<template>
  <div class="container">
    <section class="menu">
      <RouterLink 
        v-for="route in routes" 
        :key="route.path" 
        class="menu-item" 
        :to="route.path"
      >
        {{ route.name }}
      </RouterLink>
    </section>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { routes } from './routes';
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
}
.menu {
  width: 200px;
  height: 100%;
  padding: 20px;
  border-right: 1px solid #ccc;
}
.menu-item {
  color: #656967;
  display: block;
  text-decoration: none;
  margin-bottom: 10px;
  text-decoration: none;
}
.menu-item:hover {
  color: #161616;
}
.main-content {
  flex: 1;
  height: 100%;
}
</style>
