<template lang="pug">
.bg-primary.h-screen
  nav(:class="['text-white p-2 pt-4 transition-all', navClass]")
    div(:class="['flex justify-center items-center mb-4', navHeaderClass]")
      h1(v-if="!isCollapsed || isMediumScreen" class="text-xl font-bold") AnalyticUI
      button(@click="toggleNavbar" class="text-white text-center md:hidden") 
        span(v-if="isCollapsed")
          ArrowRightIcon.h-4.w-4.text-white
        span(v-else)
          ArrowLeftIcon.h-4.w-4.text-white
    ul
      li
        router-link(to="/" class="hover:bg-info p-2 rounded flex items-center")
          HomeIcon.h-4.w-4.text-white
          span.pl-2(v-show="!isCollapsed || isMediumScreen") Home
      li
        router-link(to="/campaigns" class="hover:bg-info p-2 rounded flex items-center")
          DocumentCheckIcon.h-4.w-4.text-white
          span.pl-2(v-show="!isCollapsed || isMediumScreen") Campaigns
      li
        router-link(to="/report-builder" class="hover:bg-info p-2 rounded flex items-center")
          DocumentChartBarIcon.h-4.w-4.text-white
          span.pl-2(v-show="!isCollapsed || isMediumScreen") Report Builder
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
} from "@heroicons/vue/24/outline";

const isCollapsed = ref(true);

const isMediumScreen = computed(() => {
  return window.innerWidth >= 768;
});

const navClass = computed(() => {
  return `${
    isCollapsed.value ? "w-[3rem]" : "w-[10rem]"
  } md:w-[12rem] lg:w-[15rem]`;
});

const navHeaderClass = computed(() => {
  return isCollapsed.value ? "justify-center" : "justify-between";
});

const toggleNavbar = () => {
  isCollapsed.value = !isCollapsed.value;
};

onMounted(() => {
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      isCollapsed.value = false;
    }
  });
});
</script>

<style scoped></style>
