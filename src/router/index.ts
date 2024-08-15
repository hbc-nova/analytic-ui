import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import baseChildRoutes from "./routes";

const Base = () => import("../pages/Base.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    name: "base",
    component: Base,
    children: [...baseChildRoutes],
    meta: { showNavBar: true },
  },
  // TODO
  // { path: "/error", name: "Error" },
  // { path: "*", name: "PageNotFound" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
