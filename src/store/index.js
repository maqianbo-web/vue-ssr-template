import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export function CreateStore() {
  return new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {},
  });
}
