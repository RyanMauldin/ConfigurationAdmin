// Import Vue
import Vue from "vue";

// Import Plugins
import "./plugins/bootstrap-vue";

// Imort Main App
import App from "./App.vue";

// Import Vuex
import router from "./router";
import store from "./store";

const beforeResolveFunc = (to: any, from: any, next: any) => {
  store.commit("pingSpinner");
  next();
};

router.beforeResolve(beforeResolveFunc);

const afterEachFunc = (to: any, from: any) => {
  store.commit("pingSpinner");
};

router.afterEach(afterEachFunc);

import "bootstrap";

// Import Polyfills
import "@babel/polyfill";
import "mutationobserver-shim";
import "./scripts/polyfills";

Vue.config.productionTip = false;
// These ignored elements are part of the Dom for RouteXmlConfig. By declaring these here in the
// main entry point, it is  globally registred for all child components.
Vue.config.ignoredElements = [
  "config", "rules", "rule", "startDate", "endDate", "routes",
  "route", "from", "to", "location"
];

/**
 * This is the main entry point for the project. Store is injected here, and is
 * provided to all child components of this root vue instance.
 * ```typescript
 * // Usage: <./OfficePasteControlCollection.vue>
 * public getConfigRules() { return this.$store.configRules; }
 * ```
 */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
