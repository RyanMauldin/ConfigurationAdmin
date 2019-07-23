<template>
  <div class="about">
    <a id="top"></a>
    <h1>This is an about page.</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
  constructor() {
    super();
  }
}
</script>
