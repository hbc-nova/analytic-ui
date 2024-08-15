import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/tailwind.css";
import App from "./App.vue";
import router from "./router";
import { registerGlobalComponents } from "./registerGlobalComponents";

const app = createApp(App);

registerGlobalComponents(app);

app.use(router);
app.use(createPinia());

app.mount("#app");
