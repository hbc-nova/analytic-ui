<template lang="pug">
div(class="grabbable",
  :draggable="true",
  @dragstart="setState",
  @dragend="resetState",
  @touchstart="onTouchStartHandler",
  @touchmove="onTouchMoveHandler",
  @touchend="onTouchEndHandler",
  @touchcancel="onTouchCancelHandler")
  slot(:id="id")
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCampaignStore } from "../store";
const props = defineProps<{
  id: number;
}>();

const campaignStore = useCampaignStore();
const clonedElement = ref<HTMLElement | null>(null);

const setState = () => {
  campaignStore.isMetricDragging = true;
  campaignStore.draggedMetricIndex = props.id;
};

const resetState = () => {
  campaignStore.isMetricDragging = false;
  campaignStore.draggedMetricIndex = -1;
};

const onTouchStartHandler = (event: TouchEvent) => {
  event.preventDefault();

  const targetElement = event.target as HTMLElement;
  clonedElement.value = targetElement.cloneNode(true) as HTMLElement;
  document.body.appendChild(clonedElement.value);
  clonedElement.value.style.position = "absolute";
  clonedElement.value.style.pointerEvents = "none";
  clonedElement.value.style.zIndex = "1000";
  moveClone(event);
};
const onTouchMoveHandler = (event: TouchEvent) => {
  event.preventDefault();

  if (clonedElement.value) {
    campaignStore.isMetricDragging = true;
    moveClone(event);
  }
};
const onTouchEndHandler = (event: TouchEvent) => {
  event.preventDefault();

  const chartBuilderDropzone = document.getElementById(
    "chart-builder-dropzone"
  );
  console.log(chartBuilderDropzone);
  if (chartBuilderDropzone) {
    const touch = event.changedTouches[0];
    const rect = chartBuilderDropzone.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom &&
      props.id >= 0
    ) {
      const selectedMetric = campaignStore.metrics[props.id];
      !campaignStore.selectedMetrics.includes(selectedMetric) &&
        campaignStore.selectedMetrics.push(selectedMetric);
    }
  }

  if (clonedElement.value) {
    document.body.removeChild(clonedElement.value);
    clonedElement.value = null;
  }
  resetState();
};
const onTouchCancelHandler = () => {
  if (clonedElement.value) {
    document.body.removeChild(clonedElement.value);
    clonedElement.value = null;
  }
  campaignStore.isMetricDragging = false;
};

const moveClone = (event: TouchEvent) => {
  if (clonedElement.value) {
    const touch = event.touches[0];
    clonedElement.value.style.left = `${touch.clientX - 75}px`;
    clonedElement.value.style.top = `${touch.clientY - 75}px`;
  }
};
</script>

<style scoped>
.grabbable {
  cursor: grab !important;
}
.grabbable:active {
  cursor: grabbing !important;
  opacity: 0.5;
}
</style>
