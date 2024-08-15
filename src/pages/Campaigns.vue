<template lang="pug">
div
  page-title.mb-3(title="Campaigns")
  loader(v-if="isCampaignsLoading")
  .grid(class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4")
    card.m-3.flex.flex-col.justify-between(v-for="[index, campaign] of campaigns.entries()", :key="index")
      template(v-slot)
        .p-10.capitalize(class="text-sm sm:text-lg md:text-2xl") {{ campaign.name }}
      template(#footer)
        hr
        .grid.grid-cols-2
          button.view-button.py-2(@click="() => pushToReports(index)") View
          button.edit-button.py-2(@click="() => pushToReports(index)") Edit
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCampaignStore } from "../store";
import { useRouter } from "vue-router";

const router = useRouter();

const campaignStore = useCampaignStore();
const campaigns = computed(() => campaignStore.campaigns);
const isCampaignsLoading = computed(() => campaignStore.isCampaignsLoading);

onMounted(() => {
  campaignStore.fetchAllCampaigns();
});

const pushToReports = (index: number) => {
  router.push({ name: "report-builder", params: { campaignId: index + 1 } });
};
</script>

<style scoped>
.sub-header {
  color: #94949a;
}
.view-button {
  background-color: #4492a6;
  color: #edeff5;
  font-weight: 500;
}
.edit-button {
  background-color: #909091;
  color: #edeff5;
  font-weight: 500;
}
</style>
