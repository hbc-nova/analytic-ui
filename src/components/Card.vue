<template lang="pug">
.rounded-lg.overflow-hidden.shadow-lg.card-bg-color
  .header
    slot(name="header")
  .content
    slot
  .footer
    slot(name="footer")
</template>

<script setup lang="ts"></script>

<style scoped>
.card-bg-color {
  background-color: #ebf5f5;
}
</style>
