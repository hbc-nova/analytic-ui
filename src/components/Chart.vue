<template lang="pug">
component(:data="chartData" :options="chartOptions" :is="currentComponent")
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";

import {
  BAR_CHART,
  LINE_CHART,
  DOUGHNUT_CHART,
  PIE_CHART,
  RADAR_CHART,
  POLARAREA_CHART,
} from "../constants";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler
);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
  },
  chartType: {
    type: String,
    default: BAR_CHART,
  },
});

const componentsMap: Record<string, any> = {
  [BAR_CHART]: Bar,
  [LINE_CHART]: Line,
  [DOUGHNUT_CHART]: Doughnut,
  [PIE_CHART]: Pie,
  [RADAR_CHART]: Radar,
  [POLARAREA_CHART]: PolarArea,
};

const currentComponent = computed(() => componentsMap[props.chartType]);
</script>

<style scoped>
/* Add styles here */
</style>
