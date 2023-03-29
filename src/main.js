import Vue from "vue";
import App from "./App.vue";
import { CreateRouter } from "./router";
import { CreateStore } from "./store";

Vue.config.productionTip = false;

export function createApp() {
  const router = new CreateRouter();
  const store = new CreateStore();
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  return { app, router, store };
}
