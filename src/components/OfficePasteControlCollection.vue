<template>
  <div class="office-paste-control-collection">
    <div class="title-container">
      <h2 class="title">{{title}}</h2>
    </div>
    <office-paste-control
      v-for="configRule in getConfigRules(id)"
      v-bind:ref="configRule.id"
      :key="configRule.id"
      :id="configRule.id"
      :title="configRule.title"
      :defaultData="configRule.defaultData"
      :htmlData="getRouteHtmlData(configRule.id)"
    ></office-paste-control>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Str from "../classes/Str";
import { IConfigRule } from "../classes/IConfigRule";
import OfficePasteControl from "./OfficePasteControl.vue";

@Component({
  components: {
    OfficePasteControl
  }
})
export default class OfficePasteControlCollection extends Vue {
  @Prop() private id!: string;
  @Prop() private title!: string;

  constructor() {
    super();
  }

  public getAutoPopulateTestValues(): boolean {
    return this.$store.getters.autoPopulateTestValues;
  }

  public getRouteTestValues(): string[] {
    return this.$store.getters.routeTestValues;
  }

  public getRouteConfigRules(): IConfigRule[] {
    return this.$store.getters.routeConfigRules;
  }

  public getConfigRules(id: string): IConfigRule[] {
    if (id === "routes") {
      const routeConfigRules: IConfigRule[] = this.getRouteConfigRules();
      if (!this.getAutoPopulateTestValues()) return routeConfigRules;

      const routeTestValues: string[] = this.getRouteTestValues();
      for (let index = 0; index < routeConfigRules.length; index++) {
        const routeConfigRule: IConfigRule = routeConfigRules[index];
        const routeTestValue: string = routeTestValues[index];
        routeConfigRule.defaultData =
          routeConfigRule.defaultData || routeTestValue;
      }

      return routeConfigRules;
    }

    return [];
  }

  public getRouteHtmlData(id: string): string {
    const routeValueIdentifiers = this.$store.getters.routeHtmlData;
    for (const valueIdentifier of routeValueIdentifiers) {
      if (valueIdentifier.id !== id) {
        continue;
      }

      return valueIdentifier.value;
    }

    return Str.Empty;
  }
}
</script>
