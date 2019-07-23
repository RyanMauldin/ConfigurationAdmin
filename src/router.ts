import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Str from "./classes/Str";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/About.vue").then(m => m.default)
    },
    {
      path: "/routes",
      name: "routes",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./components/Routes.vue").then(m => m.default)
    }
  ],
  scrollBehavior(to, from, savedPosition): any {
    if (typeof to !== "undefined"
      && to !== null) {
      if (typeof to.hash !== "undefined"
        && to.hash !== null
        && typeof to.hash === "string"
        && !Str.IsNullOrWhiteSpace(to.hash)) {
        return {
          selector: to.hash,
          offset: { x: 0, y: 65 }
        };
      }
      else {
        return to;
      }
    } else if (typeof savedPosition !== "undefined"
      && savedPosition !== null) {
      return savedPosition;
    } else {
      return { x: 0, y: 65 };
    }
  }
});
