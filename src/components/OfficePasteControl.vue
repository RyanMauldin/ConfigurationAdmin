<template>
  <div class="office-paste-control">
    <div class="title-container">
      <h2 class="title">{{title}}</h2>
    </div>
    <p>Paste Excel/Word data here to format:</p>
    <textarea
      v-model="data"
      @change="updateOfficePasteControlValue"
      class="office-paste-control-text-area"
      wrap="off"
    ></textarea>
    <br />
    <br />
    <p>Table data will appear below, if the operation succeeded:</p>
    <div class="excel-table" value v-html="htmlData"></div>
    <br />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Str from "../classes/Str";
import { IConfigRule } from "../classes/IConfigRule";
import { getModule } from "vuex-module-decorators";
import RouteStore from "../store/RouteStore";

@Component({})
export default class OfficePasteControl extends Vue {
  @Prop() private id!: string;
  @Prop() private title!: string;
  @Prop() private defaultData!: string;
  @Prop() private htmlData!: string;
  public data: string;
  private routeStore: RouteStore;

  constructor() {
    super();

    this.data = this.defaultData || Str.Empty;

    // we must import the module definition for us to be able to call
    // this.$store.dispatch("setOfficePasteControlHtml" later on...
    this.routeStore = getModule(RouteStore, this.$store);
  }

  public mounted(): void {
    this.updateOfficePasteControlValue();
  }

  public updateOfficePasteControlValue(): void {
    this.$store.commit("pingSpinner");

    this.$store.commit("updateConfigRule", {
      id: this.id,
      title: Str.Empty,
      startDate: Str.Empty,
      endDate: Str.Empty,
      defaultData: this.data || Str.Empty
    } as IConfigRule);

    this.setOfficePasteControlHtml();
  }

  public setOfficePasteControlHtml(): void {
    this.$store.commit("pingSpinner");

    this.$store.dispatch("setOfficePasteControlHtml", this.id).then(
      resolve => {
        // resolve();
      },
      error => {
        console.log(error.message);
      }
    );
  }
}
</script>
