<template>
  <div class="route-xml-generator">
    <a id="top"></a>
    <div class="title-container">
      <h1 class="title">{{title}}</h1>
      <br />
      <div
        class="button-group"
        :class="showAutoPopulateCollapsePanel == true ? 'dropup' : 'dropdown'"
      >
        <b-button
          ref="autoPopulateInfoButton"
          class="btn btn-success dropdown-toggle dropdown-toggle-split collapsed"
          :class="showAutoPopulateCollapsePanel == true ? 'dropup' : 'dropdown'"
          data-toggle="collapse"
          data-target="#autoPopulateCollapsePanel"
          aria-expanded="true"
          aria-controls="autoPopulateCollapsePanel"
          @click="showAutoPopulateCollapsePanel = !showAutoPopulateCollapsePanel;"
        >Auto Populate Info&nbsp;</b-button>
      </div>
      <br />
      <div
        :class="showAutoPopulateCollapsePanel == true ? 'show' : ''"
        class="collapse"
        id="autoPopulateCollapsePanel"
        v-show="formLoaded"
      >
        <div class="card card-body" style="transition: all 0.8s;">
          <div v-if="getAutoPopulateTestValues()" class="test-message">
            <p>
              To turn off the
              <b>auto-population</b> of test data in fields, set
              <span class="code">.env.development</span> file's configuration value for
              <span class="code">VUE_APP_AUTO_POPULATE_TEST_VALUES</span> equal to
              <span class="code">false</span> and rebuild the application:
            </p>
            <p>
              <span class="code">VUE_APP_AUTO_POPULATE_TEST_VALUES=false</span>
            </p>
          </div>
          <div v-else class="test-message">
            <p>
              To turn on the
              <b>auto-population</b> of test data in fields, set
              <span class="code">.env.development</span> file's configuration value for
              <span class="code">VUE_APP_AUTO_POPULATE_TEST_VALUES</span> equal to
              <span class="code">true</span> and rebuild the application:
            </p>
            <p>
              <span class="code">VUE_APP_AUTO_POPULATE_TEST_VALUES=true</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <br />
    <office-paste-control
      ref="routePeriod"
      id="routePeriod"
      title="Route Periods"
      :defaultData="getRoutePeriodTestValue()"
      :htmlData="getRoutePeriodHtmlData()"
    ></office-paste-control>
    <br />
    <p>
      After the Route Period data has been input into the controls,
      press the Generate Rules button to dynamically drive the Routes section.
    </p>
    <b-button
      ref="generateRulesButton"
      variant="success"
      @click="generateRules()"
      class="btn btn-success"
    >Generate Rules</b-button>
    <br />
    <br />
    <hr />
    <div v-show="(getRouteConfigRules() || []).length > 0">
      <office-paste-control-collection
        :id="routeIdentifier"
        :ref="routeIdentifier"
        title="Route Rules"
      ></office-paste-control-collection>
      <br />
      <p class="text-left">
        After you have finished filling out the
        <span class="strong">Route</span> rule sets, press the
        <span class="strong">Generate Config</span> button. If this operation is successful,
        the
        <span class="strong">XML Output</span> section will populate with a list of values.
        The underly values are actually
        <span
          class="strong"
        >XML</span> in the
        <span class="strong">Dom</span>.
        To easily capture the formatted
        <span class="strong">XML</span> data to your
        <span class="strong">clipboard</span>,
        please then press the
        <span class="strong">Copy to Clipboard</span> button.
      </p>
      <div class="button-group">
        <b-button
          ref="generateConfigButton"
          variant="success"
          @click="generateXml()"
          class="btn btn-success"
        >Generate Config</b-button>
        <b-button
          v-b-modal.modal-lg
          v-b-modal.modal-scrollable-xmlDataToCopy
          class="btn btn-success"
          @click="copyConfigXml"
        >Copy to Clipboard</b-button>
        <b-modal
          id="modal-scrollable-xmlDataToCopy"
          scrollable
          title="Copy to Clipboard Confirmation"
          header-bg-variant="success"
          header-text-variant="light"
          body-bg-variant="light"
          body-text-variant="dark"
          footer-bg-variant="light"
          footer-text-variant="dark"
          ok-only
          ok-variant="success"
        >
          <p>Copied the following XML to Clipboard:</p>
          <p>
            <code>{{this.xmlDataToCopyValue}}</code>
          </p>
        </b-modal>
      </div>
      <br />
      <br />
      <route-xml-config ref="xmlConfig" title="Xml Output"></route-xml-config>
      <br />
      <br />
      <textArea
        ref="xmlDataToCopy"
        v-model="xmlDataToCopyValue"
        v-show="dataToCopyVisible"
        class="xmlDataToCopy"
      ></textArea>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { BToast } from "bootstrap-vue";
Vue.component("b-toast", BToast);
import dateformat from "dateformat";
import Format from "xml-formatter";
import Str from "../classes/Str";
import { IConfigRule } from "../classes/IConfigRule";
import RouteXmlConfig from "./RouteXmlConfig.vue";
import OfficePasteControl from "./OfficePasteControl.vue";
import OfficePasteControlCollection from "./OfficePasteControlCollection.vue";

@Component({
  components: {
    OfficePasteControl,
    OfficePasteControlCollection,
    RouteXmlConfig,
    BToast
  }
})
export default class RouteXmlGenerator extends Vue {
  @Prop() private title!: string;
  @Prop() private autoPopulateTestValues!: boolean;
  public dataToCopyVisible: boolean;
  public xmlDataToCopyValue: string;
  public routePeriodInitialValue: string;
  public routeValues: string[];
  public routeJson: string[][][];
  private routeIdentifier: string;
  private formLoaded: boolean;
  private showAutoPopulateCollapsePanel: boolean;

  public $refs!: {
    routePeriod: OfficePasteControl;
    generateRulesButton: HTMLButtonElement;
    routes: OfficePasteControlCollection;
    generateConfigButton: HTMLButtonElement;
    copyConfigButton: HTMLButtonElement;
    xmlConfig: RouteXmlConfig;
    xmlDataToCopy: HTMLTextAreaElement;
    autoPopulateInfoButton: HTMLButtonElement;
  };

  constructor() {
    super();

    this.dataToCopyVisible = false;
    this.xmlDataToCopyValue = Str.Empty;
    this.routePeriodInitialValue = Str.Empty;
    this.routeValues = [];
    this.routeJson = [];
    this.routeIdentifier = "routes";
    this.formLoaded = false;
    this.showAutoPopulateCollapsePanel = true;
  }

  public mounted(): Promise<void> {
    return new Promise(resolve => {
      this.$nextTick(() => {
        // Trick for not having document.load and $().accordian...
        const autoPopulateInfoButton = this.$refs.autoPopulateInfoButton;
        autoPopulateInfoButton.click();
        autoPopulateInfoButton.click();

        // Make sure accordian content was hidden, now can show...
        this.formLoaded = true;

        this.tryRunAutoPopulateTestValues();
        resolve();
      });
    });
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

  public getAutoPopulateTestValues(): boolean {
    return this.$store.getters.autoPopulateTestValues;
  }

  public getRoutePeriodTestValue(): string {
    return this.$store.getters.routePeriodTestValue;
  }

  public getRouteTestValues(): string[] {
    return this.$store.getters.routeTestValues;
  }

  public getRoutePeriodJson(): string[][] {
    return this.$store.getters.routePeriodJson;
  }

  public getRoutePeriodHtmlData(): string {
    return this.$store.getters.routePeriodHtmlData;
  }

  public getRouteJson(): string[][][] {
    return this.$store.getters.routeJson;
  }

  public clearConfigRules() {
    this.$store.commit("clearConfigRules");
  }

  public addConfigRule(configRule: IConfigRule) {
    this.$store.commit("addConfigRule", configRule);
  }

  public tryRunAutoPopulateTestValues(): Promise<void> {
    const routePeriod = this.$refs.routePeriod;
    const routes = this.$refs.routes;

    if (
      this.getAutoPopulateTestValues() === false ||
      typeof routePeriod === "undefined" ||
      routePeriod == null ||
      typeof routes === "undefined" ||
      routes === null
    ) {
      return new Promise(resolve => {
        resolve();
      });
    }

    const unitTestStage1 = new Promise(resolve => {
      this.$nextTick(() => {
        this.generateRules();
        resolve();
      });
    });

    const unitTestStage2 = unitTestStage1.then(resolve => {
      this.$nextTick(() => {
        this.generateXml();
      });
    });

    return unitTestStage2;
  }

  public generateRules(): void {
    this.$store.commit("pingSpinner");

    const sucessVariant = "success";
    const dangerVariant = "danger";

    const routes = this.$refs.routes;
    if (routes == null) {
      this.$bvToast.toast("Could not find Routes.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return;
    }

    // Fetch rules
    this.clearConfigRules();

    this.$nextTick(() => {
      this.$store.commit("pingSpinner");

      const routePeriodJson = this.getRoutePeriodJson();
      if (routePeriodJson == null) {
        this.$bvToast.toast("Could not fetch Route Period.", {
          title: `Variant ${dangerVariant || "default"}`,
          variant: dangerVariant,
          solid: true
        });
        return;
      }

      const routePeriodLength = routePeriodJson.length;

      if (routePeriodLength === 0) {
        this.$bvToast.toast("Could not fetch Route Period..", {
          title: `Variant ${dangerVariant || "default"}`,
          variant: dangerVariant,
          solid: true
        });
        return;
      }

      let index = 0;
      for (let ruleIndex = 0; ruleIndex < routePeriodLength; ruleIndex++) {
        const ruleCell = routePeriodJson[ruleIndex][0];
        if (
          Str.IsNullOrWhiteSpace(ruleCell) ||
          ruleCell.trim().toUpperCase() === "TRAVEL PERIOD"
        )
          continue; // row is empty or it the header data, skip row

        const now = new Date();
        const currentFullYear = now.getFullYear();
        const currentCentury = Number.parseInt(
          currentFullYear.toString().substring(0, 2) + "00",
          10
        );

        // Process rule travel period like 13JUN-12AUG19
        const dates = ruleCell.split("-");
        let startDateStr = dates[0];
        let endDateStr = dates[1];

        if (
          Str.IsNullOrWhiteSpace(startDateStr) ||
          Str.IsNullOrWhiteSpace(endDateStr)
        ) {
          this.$bvToast.toast(
            "Could not parse start and end dates for one or more rules.",
            {
              title: `Variant ${dangerVariant || "default"}`,
              variant: dangerVariant,
              solid: true
            }
          );
          return;
        }

        const year =
          Number.parseInt(
            endDateStr.substring(endDateStr.length - 2, endDateStr.length),
            10
          ) + currentCentury;
        startDateStr =
          startDateStr.substring(0, 2) +
          " " +
          startDateStr.substring(2, startDateStr.length) +
          " " +
          year.toString();
        endDateStr = endDateStr.substring(0, endDateStr.length - 2);
        endDateStr =
          endDateStr.substring(0, 2) +
          " " +
          endDateStr.substring(2, endDateStr.length) +
          " " +
          year.toString();
        const startDate = new Date(Date.parse(startDateStr));
        const endDate = new Date(Date.parse(endDateStr));

        let routeValue = Str.Empty;

        this.routeValues = this.getRouteTestValues();

        if (
          this.getAutoPopulateTestValues() === true &&
          typeof this.routeValues !== "undefined" &&
          this.routeValues !== null &&
          this.routeValues.length > 0 &&
          ruleIndex < this.routeValues.length
        ) {
          routeValue = this.routeValues[ruleIndex];
        }

        this.addConfigRule({
          id: this.routeIdentifier + index.toString(),
          title:
            `Route properties from: ${dateformat(startDate, "mm/dd/yyyy")}` +
            ` - ${dateformat(endDate, "mm/dd/yyyy")}`,
          startDate: dateformat(startDate, "mm/dd/yyyy"),
          endDate: dateformat(endDate, "mm/dd/yyyy"),
          defaultData: routeValue
        } as IConfigRule);
        index++;
      }

      this.$bvToast.toast(
        "Rules were generated successfully. Next click Generate Config when all data is entered.",
        {
          title: `Variant ${sucessVariant || "default"}`,
          variant: sucessVariant,
          solid: true
        }
      );
    });
  }

  public generateXml(): Promise<void> {
    this.$store.commit("pingSpinner");

    const generateXmlStage1 = new Promise(resolve => {
      this.$nextTick(() => {
        this.generateRouteJson();
        resolve();
      });
    });

    const generateXmlStage2 = generateXmlStage1.then(resolve => {
      this.$nextTick(() => {
        this.generateXmlConfig();
      });
    });

    return generateXmlStage2;
  }

  public generateRouteJson(): void {
    this.$store.commit("pingSpinner");

    const sucessVariant = "success";
    const dangerVariant = "danger";

    const routes = this.$refs.routes;
    this.routeJson = [];

    if (routes == null) {
      this.$bvToast.toast("Could not find Routes.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return;
    }

    this.routeJson = this.getRouteJson();
  }

  public generateXmlConfig(): void {
    this.$store.commit("pingSpinner");

    const routes = this.$refs.routes;
    const xmlConfig = this.$refs.xmlConfig;
    const sucessVariant = "success";
    const dangerVariant = "danger";

    if (routes == null || xmlConfig == null) {
      this.$bvToast.toast("Could not find Routes or the XML config.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return;
    }

    if (
      typeof this.routeJson === "undefined" ||
      this.routeJson === null ||
      this.routeJson.length <= 0
    ) {
      xmlConfig.hide();
      this.$bvToast.toast("No data was found to convert to XML.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return;
    }

    xmlConfig.createXmlConfig(this.routeJson);
    xmlConfig.show();

    this.$bvToast.toast("XML Markup Generated. Click Copy to Clipboard next.", {
      title: `Variant ${sucessVariant || "default"}`,
      variant: sucessVariant,
      solid: true
    });
  }

  public copyConfigXml(): string {
    this.$store.commit("pingSpinner");

    const sucessVariant = "success";
    const dangerVariant = "danger";

    const xmlConfig = this.$refs.xmlConfig;
    const xmlDataToCopy = this.$refs.xmlDataToCopy;
    if (xmlConfig == null || xmlDataToCopy == null) {
      this.$bvToast.toast("Could not find XML config.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return "Unable to copy data to clipboard.";
    }

    const xmlData = xmlConfig.getXmlDataElement();
    if (xmlData == null) {
      this.$bvToast.toast("Could not find fetch copy of XML for Clipboard.", {
        title: `Variant ${dangerVariant || "default"}`,
        variant: dangerVariant,
        solid: true
      });
      return "Unable to copy data to clipboard.";
    }

    const options = {
      indentation: "  ",
      stripComments: true,
      collapseContent: true
    };

    this.xmlDataToCopyValue = Format(xmlData.innerHTML, options);

    this.$nextTick(() => {
      this.$store.commit("pingSpinner");

      this.dataToCopyVisible = true;
      this.$nextTick(() => {
        this.$store.commit("pingSpinner");

        xmlDataToCopy.value = this.xmlDataToCopyValue;
        xmlDataToCopy.select();
        document.execCommand("copy");
        this.$nextTick(() => {
          this.$store.commit("pingSpinner");

          this.dataToCopyVisible = false;
        });
      });
    });

    return this.xmlDataToCopyValue;
  }
}
</script>
