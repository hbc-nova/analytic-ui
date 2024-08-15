<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Title,
} from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Title
);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance: any = ref<Chart | null>(null);

const initialData = {
  labels: ["Category 1", "Category 2", "Category 3"],
  datasets: [
    {
      label: "Initial Data",
      data: [10, 20, 30],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

const detailedData: any = {
  "Category 1": {
    labels: ["Detail 1", "Detail 2", "Detail 3"],
    datasets: [
      {
        label: "Details of Category 1",
        data: [5, 10, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  },
  "Category 2": {
    labels: ["Detail 1", "Detail 2", "Detail 3"],
    datasets: [
      {
        label: "Details of Category 2",
        data: [7, 14, 21],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  },
  "Category 3": {
    labels: ["Detail 1", "Detail 2", "Detail 3"],
    datasets: [
      {
        label: "Details of Category 3",
        data: [9, 18, 27],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  },
};

const createChart = () => {
  if (chartCanvas.value) {
    chartInstance.value = new Chart(chartCanvas.value, {
      type: "bar",
      data: initialData,
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const elementIndex = elements[0].index;
            const label = initialData.labels[elementIndex];
            if (label && detailedData[label]) {
              // console.log("HEre");
              // updateChart(detailedData[label]);
              // if (chartInstance.value) {
              //   chartInstance.value.data = detailedData[label];
              //   chartInstance.value.update();
              // }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

const updateChart = (newData: any) => {
  if (chartInstance.value) {
    chartInstance.value.data = newData;
    chartInstance.value.update();
  }
};

onMounted(() => {
  createChart();
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
