<template>
  <div class="side-bar">
    <input class="search-input" placeholder="Search" v-model="searchInput" />
    <div class="side-bar-item" v-for="route in routes" :key="route.path">
      <router-link :to="route.path">{{ route.name }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const router = useRouter();

const searchInput = ref('');

const routes = computed(() => {
  const routes = router.getRoutes();
  return routes.filter(
    (route) =>
      route.name &&
      route.name.toString().toLowerCase().includes(searchInput.value.toLowerCase()),
  );
});
</script>

<style scoped lang="scss">
@use 'sass:color';

.search-input {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
  outline: none;
  border: none;
  border: 1px solid #e0e0e0;
  &:focus {
    border-color: color.adjust(#e0e0e0, $lightness: -10%);
  }
  &:hover {
    border-color: color.adjust(#e0e0e0, $lightness: -10%);
  }
}
.side-bar {
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
  padding: 10px;
  &-item {
    width: 100%;
    height: 25px;
    background-color: #f0f0f0;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    padding: 0 10px;
    &:hover {
      background-color: #e0e0e0;
    }
    a {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
