<template lang="pug">
.h-list-view(v-if="selectedMetrics?.length")
  .text-xs.mb-1 {{ labelText }}
  .list-view-wrapper.flex.flex-wrap
    .list-view-element.px-2.py-1.m-2.flex.items-center(v-for="[index, metric] of selectedMetrics.entries()", :key="index")
      .text-xs.capitalize.mr-1.font-medium {{ metric }}
      XMarkIcon.h-4.w-4.ml-1.cross-icon.cursor-pointer(@click="deleteHandler(index)")
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useCampaignStore } from "../store";

const props = defineProps({
  labelText: {
    type: String,
    default: "",
  },
});

const campaignStore = useCampaignStore();
const { selectedMetrics } = campaignStore;

const deleteHandler = (index: number) => selectedMetrics.splice(index, 1);
</script>

<style scoped>
.list-view-wrapper {
  border: 1px solid #8b96a2;
  border-radius: 0.25rem;
}
.list-view-element {
  border: 1px solid #adaecb;
  border-radius: 0.5rem;
  background-color: #e0e0ea;
}
.cross-icon {
  color: #aa2407;
}
</style>
