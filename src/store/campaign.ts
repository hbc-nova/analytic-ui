import axios from "axios";
import { defineStore } from "pinia";
import { Campaign } from "../interfaces";
import { processAndFormatMetrics } from "../utils";

export const useCampaignStore = defineStore("chart", {
  state: () => ({
    isCampaignsLoading: false,
    isMetricsLoading: false,
    isMetricDragging: false,
    isChartLoading: false,
    draggedMetricIndex: -1,
    metrics: [] as string[],
    chartType: "bar",
    campaignName: "",
    selectedMetrics: ["ctr", "impressions"],
    campaigns: [] as any,
    db: [] as any,
  }),
  getters: {
    getChartData: (state) => state,
    getMetrics: (state) => state.metrics,
    getChartType: (state) => state.chartType,
    getSelectedMetrics: (state) => state.selectedMetrics,
    getCampaigns: (state) => state.campaigns,
    getCampaignName: (state) => state.campaignName,
    getCampaignData: (state) => state.db,
  },
  actions: {
    async fetchAllCampaignData() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

      if (!apiBaseUrl) {
        console.log("Please configure API base url to proceed");
        return;
      }

      this.db = [];
      this.isChartLoading = true;
      try {
        const campaignData = await axios.get<Campaign>(
          `${apiBaseUrl}/campaign`
        );
        if (campaignData.data) this.db = campaignData.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isChartLoading = false;
      }
    },
    async fetchMetrics() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const campaignId = 1;

      if (!apiBaseUrl) {
        console.log("Please configure API base url to proceed");
        return;
      }

      this.metrics = [];
      this.isMetricsLoading = true;
      try {
        const campaignData = await axios.get<Campaign>(
          `${apiBaseUrl}/campaign/${campaignId}`
        );
        if (campaignData.data)
          this.metrics = processAndFormatMetrics(
            campaignData.data
          ) as unknown as string[];
      } catch (err) {
        console.log(err);
      } finally {
        this.isMetricsLoading = false;
      }
    },
    async fetchAllCampaigns() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

      if (!apiBaseUrl) {
        console.log("Please configure API base url to proceed");
        return;
      }

      this.campaigns = [];
      this.isCampaignsLoading = true;
      try {
        const campaignData = await axios.get<Campaign>(
          `${apiBaseUrl}/companies`
        );
        if (campaignData.data) this.campaigns = campaignData.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isCampaignsLoading = false;
      }
    },
  },
});
