<template>
  <div class="route-xml-config" v-if="visible">
    <h2>{{title}}</h2>
    <p>Xml data will appear below:</p>
    <div ref="xmlData">
      <config>
        <rules>
          <rule v-for="(configRule, index) in getConfigRules('routes')" :key="configRule.id">
            <startDate>{{configRule.startDate}}</startDate>
            <endDate>{{configRule.endDate}}</endDate>
            <routes>
              <route>
                <from>
                  <location
                    v-for="(location, locationIndex) in getRoutes(index)"
                    :key="locationIndex"
                  >{{formatLocation(location, 0)}}</location>
                </from>
                <to>
                  <location
                    v-for="(location, locationIndex) in getRoutes(index)"
                    :key="locationIndex"
                  >{{formatLocation(location, 2)}}</location>
                </to>
              </route>
            </routes>
          </rule>
        </rules>
      </config>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Str from "../classes/Str";
import { IConfigRule } from "../classes/IConfigRule";
import OfficePasteControl from "./OfficePasteControl.vue";

@Component({})
export default class RouteXmlConfig extends Vue {
  @Prop() private title!: string;
  public jsonData: string[][][];
  public visible: boolean;

  public $refs!: {
    xmlData: HTMLDivElement;
  };

  constructor() {
    super();

    this.jsonData = [];
    this.visible = false;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public getRouteConfigRules(): IConfigRule[] {
    return this.$store.getters.routeConfigRules;
  }

  public getConfigRules(id: string) {
    if (id === "routes") {
      const routeConfigRules: IConfigRule[] = this.getRouteConfigRules();
      return routeConfigRules;
    }

    return [];
  }

  public getXmlDataElement(): HTMLDivElement {
    return this.$refs.xmlData;
  }

  public createXmlConfig(data: string[][][]): void {
    this.jsonData = [];
    this.jsonData = data;

    this.show();
  }

  public getRoutes(index: any): string[][] {
    if (index == null || Number.isNaN(index)) return [];

    return this.jsonData[index];
  }

  public formatLocation(location: string[], propertyIndex: any): string {
    if (location == null || !Array.isArray(location)) return Str.Empty;

    if (propertyIndex == null || Number.isNaN(propertyIndex)) return Str.Empty;

    const value = location[propertyIndex.toString()];

    return value != null ? value : Str.Empty;
  }
}
</script>
