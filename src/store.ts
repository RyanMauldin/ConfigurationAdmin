import Vue from "vue";
import Vuex from "vuex";
import RouteStore from "./store/RouteStore";
import SpinnerStore from "./store/SpinnerStore";
import TestValueStore from "./store/TestValueStore";

Vue.use(Vuex);

/**
 * This class is the main entry point for all Store Modules that will be pulled into
 * the Root Vue component for global shared state and inter component communication.
 *
 * ```typescript
 * // Usage: <./main.ts>
 * import store from "./store";
 * new Vue({ router, store, render: h => h(App) }).$mount("#app");
 * // Usage: <./OfficePasteControlCollection.vue>
 * public getConfigRules() { return this.$store.getters.configRules; }
 * ```
 */
const store = new Vuex.Store({
  state: {},
  modules: {
    RouteStore,
    SpinnerStore,
    TestValueStore
  }
});

export default store;
