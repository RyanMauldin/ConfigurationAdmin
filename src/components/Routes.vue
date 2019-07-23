<template>
  <div class="routes">
    <route-xml-generator title="Route Xml Settings"></route-xml-generator>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EnvHelper from "../classes/EnvHelper";
import RouteXmlGenerator from "./RouteXmlGenerator.vue";

@Component({
  components: {
    RouteXmlGenerator
  }
})
export default class Routes extends Vue {
  constructor() {
    super();

    // Set auto populate toggle to true if you wish the RouteXmlGenerator
    // child components to fill themselve's out
    // with values.
    this.setAutoPopulateTestValues(
      EnvHelper.getBoolean(process.env
        .VUE_APP_AUTO_POPULATE_TEST_VALUES as boolean)
    );

    this.storeConfig();
  }

  public storeConfig(): void {
    this.$store.commit("config");
  }

  public setAutoPopulateTestValues(autoPopulateTestValues: boolean): void {
    this.$store.commit("setAutoPopulateTestValues", autoPopulateTestValues);
  }
}
</script>
