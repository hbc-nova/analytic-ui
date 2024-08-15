<template lang="pug">
div
  .text-2xl.font-semibold.text-primary {{ title }}
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped></style>
