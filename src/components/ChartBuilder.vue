<template lang="pug">
.grid.grid-cols-5.gap-4
  card.available-metrics-card(class="col-span-5 md:col-span-1")
    template(#header)
      .p-3
        .p-2.flex.items-center.font-medium(class="text-md lg:text-xl")
          AdjustmentsVerticalIcon.h-4.w-4
          span.flex-1.ml-2.available-metrics-card-header Metrics
        hr.my-2
    template(v-slot)
      loader(v-if="campaignStore.isMetricsLoading")
      .available-metrics-card-body(v-else, class="min-h-[30vh] md:min-h-[60vh] max-h-[40vh] md:max-h-[70vh]")
        .flex.flex-wrap.justify-center
          draggable-item(v-for="[index, metric] of campaignStore.metrics.entries()", :key="index", :id="index")
            span.metrics-wrapper.shadow-lg.px-1 {{ metric }}
  card.available-metrics-card(class="col-span-5 md:col-span-4")
    template(#header)
      .p-3
        .p-2.flex.items-center.text-xl.font-medium
          ChartPieIcon.h-4.w-4
          span.flex-1.ml-2.available-metrics-card-header Chart
        hr.my-2
    template(v-slot)
      loader(v-if="campaignStore.isChartLoading")
      drop-zone.p-5#chart-builder-dropzone(v-else)
        hlist-view(labelText="Included Metrics")
        div(class="grid grid-cols-1 lg:flex lg:grid-cols-3")
          .flex.items-center.mt-2.mr-2
            dropdown(labelText="Campaigns", :buttonText="campaignName", :menuOptions="campaignOptions", @click="campaignNameDropdownChangeHandler")
          .flex.items-center.mt-2
            dropdown(labelText="Chart Type", :buttonText="chartType", :menuOptions="CHART_TYPES", @click="chartTypeDropdownChangeHandler")
          .flex.items-end(class="ml-0 lg:ml-4")
            button.max-w-32(type="button", @click="() => updateIsModalOpen(true)" 
              class="p-3 my-3 lg:my-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-teal-200 dark:focus:ring-teal-300 font-medium rounded-lg text-xs text-center")
                | Expression Filter
        .m-5
          chart(:chartData="chartData", :chartOptions="chartOptions", :chartType="chartType")
      modal(:shouldOpenModal="isModalOpen", :closeModal="() => updateIsModalOpen(false)")
        template(v-slot)
          div(class="mt-2 min-h-[15rem] min-w-[20rem]")
            .grid.grid-cols-1.my-3(v-for="[index, ex] of expressions.entries()", :key="index", class="md:grid-cols-4")
              dropdown(labelText="Metric", :buttonText="ex.metric", :menuOptions="[...campaignStore.metrics, 'created_date']", @click="(val) => updateExpressions(index, 'metric', val)")
              dropdown(labelText="Expression", :buttonText="ex.expression", :menuOptions="EXPRESSION_TYPES", @click="(val) => updateExpressions(index, 'expression', val)")
              div
                .text-xs.mb-1(v-if="ex['expression'] === DATE_BETWEEN") Start or End Date
                .text-xs.mb-1(v-else) Value
                div.grid(v-if="ex['expression'] === DATE_BETWEEN")
                  input.expression-input(type="date", v-model="ex.startDate")
                  input.expression-input(type="date", v-model="ex.endDate")
                input.expression-input(v-else, type="text", v-model="ex.value")
              XMarkIcon.w-4.h-4.cursor-pointer.expression-cross-icon.mb-1(@click="() => removeExpression(index)")
            button.mt-3(@click="addExpression", type="button", class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2")
              | Add Expression
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AdjustmentsVerticalIcon,
  ChartPieIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useCampaignStore } from "../store";
import { CHART_TYPES, EXPRESSION_TYPES, DATE_BETWEEN } from "../constants";
import { parseRawData } from "../utils";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();
const expressions: any = reactive([{ metric: "", expression: "", value: "" }]);

if (!route?.params?.campaignId) {
  router.push({
    name: "report-builder",
    params: { campaignId: 1 },
  });
}

const chartData = computed(() =>
  parseRawData(
    campaignData.value,
    selectedMetrics.value,
    parseInt(route.params.campaignId as string),
    campaignStore,
    expressions
  )
);
const isModalOpen = ref(false);
const chartType = computed(() => campaignStore.getChartType);
const campaignName = computed(() => campaignStore.getCampaignName);
const campaignData = computed(() => campaignStore.getCampaignData);
const selectedMetrics = computed(() => campaignStore.getSelectedMetrics);
const campaignOptions = computed(() =>
  campaignStore.getCampaigns.map(({ name }: { name: string }) => name)
);

const findCampaign = (key: string, campaignId: any) => {
  return campaignStore.getCampaigns.find(
    (campaign: any) => campaign[key] === campaignId
  );
};

const matchedCampaign = findCampaign("id", route.params?.campaignId);
if (matchedCampaign?.name) campaignStore.campaignName = matchedCampaign.name;

onMounted(() => {
  campaignStore.fetchAllCampaigns();
  campaignStore.fetchMetrics();
  campaignStore.fetchAllCampaignData();
});

watch(
  () => route.params.campaignId,
  (newVal, oldVal) => {
    const matchedCampaign = findCampaign("id", newVal);
    if (matchedCampaign?.name)
      campaignStore.campaignName = matchedCampaign.name;
  }
);

watch(
  () => campaignStore.getCampaigns,
  (newVal, oldVal) => {
    if (route.params?.campaignId) {
      const matchedCampaign = newVal.find(
        (campaign: any) => campaign.id === route.params.campaignId
      );
      if (matchedCampaign?.name)
        campaignStore.campaignName = matchedCampaign.name;
    }
  }
);

const updateIsModalOpen = (v: boolean) => (isModalOpen.value = v);

const chartTypeDropdownChangeHandler = (value: string) =>
  (campaignStore.chartType = value);

const campaignNameDropdownChangeHandler = (value: string) => {
  const matchedCampaign = findCampaign("name", value);
  if (matchedCampaign.id)
    router.push({
      name: "report-builder",
      params: { campaignId: matchedCampaign.id },
    });
};

const updateExpressions = (index: number, key: string, val: any) => {
  if (typeof val === "string") expressions[index][key] = val;
};

const removeExpression = (index: number) => {
  expressions.splice(index, 1);
};

const addExpression = () => {
  expressions.push({ metric: "", expression: "" });
};
</script>

<style scoped>
.available-metrics-card {
  /* height: 90vh; */
  background-color: #ebf2f2;
}
.available-metrics-card-header {
  color: #2d3b3b;
}
.metrics-wrapper {
  height: 3rem;
  min-width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #8b96a2;
  border-radius: 0.25rem;
  background-color: #dde1e4;
  margin: 1rem;
  text-transform: capitalize;
  font-weight: 500;
  font-size: small;
}
.available-metrics-card-body {
  /* min-height: 60vh;
  max-height: 70vh; */
  overflow-y: auto;
}
.expression-input {
  border: 1px solid #8b96a2;
  border-radius: 0.25rem;
  height: 1.5rem;
  align-self: self-end;
}
.expression-cross-icon {
  align-self: self-end;
  justify-self: center;
  color: #aa2407;
}
</style>
