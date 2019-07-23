<template>
  <div id="app">
    <div class="header-container">
      <div class="logo-container">
        <router-link class="nav-link" wrap="off" to="/#top" tag="div">
          <img
            src=".\assets\ConfigurationAdminLogo.png"
            alt="Config Admin"
            class="header-logo-img hide-sm hide-md"
          />
        </router-link>
      </div>
      <div class="header-footer-backdrop">
        <div class="header-footer"></div>
      </div>
    </div>
    <div class="app-container">
      <!-- built files will be auto injected -->
      <div class="page-content">
        <router-view />
      </div>
      <div class="footer-container-backdrop">
        <div class="footer-container"></div>
      </div>
    </div>
    <div class="footer"></div>
    <div class="admin-spinner" v-show="isSpinnerActive()">
      <b-spinner variant="text-light"></b-spinner>
    </div>
    <div class="hamburger-slideout">
      <Slide
        right
        :isOpen="isTopNavOpen"
        @openMenu="handleOpenMenu"
        @closeMenu="handleCloseMenu"
        :burgerIcon="true"
      >
        <router-link class="nav-link" wrap="off" to="/#top" tag="div">Home</router-link>
        <router-link class="nav-link" wrap="off" to="/routes#top" tag="div">Routes</router-link>
        <router-link class="nav-link" wrap="off" to="/about#top" tag="div">About</router-link>
      </Slide>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as VueBurgerMenu from "vue-burger-menu";

const Slide = VueBurgerMenu.Slide;

@Component({
  components: {
    Slide
  }
})
export default class App extends Vue {
  public isTopNavOpen: boolean;

  constructor() {
    super();

    this.isTopNavOpen = false;
  }

  public isSpinnerActive(): boolean {
    return this.$store.getters.isSpinnerActive;
  }

  public handleOpenMenu(): void {
    this.isTopNavOpen = true;
  }

  public handleCloseMenu(): void {
    this.isTopNavOpen = false;
  }
}
</script>

<style lang="less">
@import "./styles/app.module.less";
</style>
