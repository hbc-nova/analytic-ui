<template lang="pug">
.relative(@dragover.prevent, @drop="onDropListener")
  .drop-zone-wrapper.absolute.flex.items-center.justify-center.inset-0.m-3(:class="getDropZoneWrapperClass()")
    .text-xl.font-semibold.uppercase Drop your items here
  slot
</template>

<script setup lang="ts">
import { useCampaignStore } from "../store";

const onDropListener = () => {
  campaignStore.isMetricDragging = false;
  if (campaignStore.draggedMetricIndex < 0) return;
  const selectedMetric =
    campaignStore.metrics[campaignStore.draggedMetricIndex];
  if (!campaignStore.selectedMetrics.includes(selectedMetric)) {
    campaignStore.selectedMetrics.push(selectedMetric);
  }
};

const campaignStore = useCampaignStore();

const getDropZoneWrapperClass = () => {
  return campaignStore.isMetricDragging ? "drop-zone-wrapper-active" : "";
};
</script>

<style scoped>
.drop-zone-wrapper {
  z-index: -1;
}
.drop-zone-wrapper-active {
  z-index: 2 !important;
  background-color: #bdd1de;
  border: 2px dashed #6f9fbf;
  border-radius: 0.25rem;
  color: #246087;
}
</style>
