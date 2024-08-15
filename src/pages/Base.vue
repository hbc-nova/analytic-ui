<template lang="pug">
div.flex
  nav-bar(v-if="route?.meta?.showNavBar")
  main(class="flex-1 p-4")
    router-view
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style scoped></style>
