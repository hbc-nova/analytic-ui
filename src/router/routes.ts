import { RouteRecordRaw } from "vue-router";

const ReportBuilder = () => import("../pages/ReportBuilder.vue");
const Campaigns = () => import("../pages/Campaigns.vue");
const Home = () => import("../pages/Home.vue");

const baseChildRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    name: "home",
    component: Home,
    meta: { showNavBar: true },
  },
  {
    path: "/report-builder/:campaignId?",
    name: "report-builder",
    component: ReportBuilder,
    meta: { showNavBar: true },
  },
  {
    path: "/campaigns",
    name: "campaigns",
    component: Campaigns,
    meta: { showNavBar: true },
  },
];

export default baseChildRoutes;
