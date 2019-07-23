import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Obj from "../classes/Obj";
import Str from "../classes/Str";
import { IConfigRule } from "../classes/IConfigRule";
import { IValueIdentifier } from "../classes/IValueIdentifier";

/**
 * This class is used as a Store Module that will be pulled into the Root Vue component,
 * for global shared state and inter component communication.
 *
 * ```typescript
 * // Usage: <./Store.ts>
 * import RouteStore from "./store/RouteStore";
 * Vue.use(Vuex);
 * const store = new Vuex.Store({ state: {}, modules: { RouteStore, TestValueStore } });
 * export default store;
 * // Usage: <./main.ts>
 * import store from "./store";
 * new Vue({ router, store, render: h => h(App) }).$mount("#app");
 * // Usage: <./OfficePasteControlCollection.vue>
 * public getRouteConfigRules() { return this.$store.getters.routeConfigRules; }
 * ```
 */
@Module({ name: "RouteStore" })
export default class RouteStore extends VuexModule {
    private _routePeriodRule: IConfigRule = {
        id: "routePeriod",
        title: Str.Empty,
        startDate: Str.Empty,
        endDate: Str.Empty,
        defaultData: Str.Empty
    } as IConfigRule;
    private _routePeriodHtmlData: IValueIdentifier = {
        id: "routePeriod",
        value: Str.Empty
    } as IValueIdentifier;

    private _routeConfigRules: IConfigRule[] = [];
    private _routeHtmlData: IValueIdentifier[] = [];

    @Mutation
    public clearConfigRules(): void {
        this._routeConfigRules = [];
        this._routeHtmlData = [];
    }

    @Mutation
    public addConfigRule(value: IConfigRule): void {
        const valueClone: IConfigRule = Obj.clone(value);
        this._routeConfigRules.push(valueClone);
        this._routeHtmlData.push({
            id: valueClone.id,
            value: Str.Empty
        } as IValueIdentifier);
    }

    @Mutation
    public updateConfigRule(value: IConfigRule): void {
        const valueClone: IConfigRule = Obj.clone(value);

        if (valueClone.id === "routePeriod") {
            this._routePeriodRule.defaultData = valueClone.defaultData;
            return;
        }

        for (const rule of this._routeConfigRules) {
            if (rule.id !== valueClone.id)
                continue;

            rule.defaultData = valueClone.defaultData;
            return;
        }
    }

    @Action({ commit: "clearConfigRules" })
    public clearConfigRulesCommit(): void {
        return;
    }

    @Action({ commit: "addConfigRule" })
    public addConfigRuleCommit(value: IConfigRule): IConfigRule {
        return value;
    }

    // action 'incr' commits mutation 'increment' when done with return value as payload
    @Action({ commit: "updateConfigRule" })
    public updateConfigRuleCommit(value: IConfigRule): IConfigRule {
        return value;
    }

    @Action
    public setOfficePasteControlHtml(id: string): Promise<void> {
        const self = this;
        return new Promise<void>(resolve => {
            const defaultValue: string = "<table class=\"table-center\" />";
            if (Str.IsNullOrWhiteSpace(id)) {
                return;
            }

            if (id === "routes") {
                if (typeof self._routePeriodRule !== "undefined"
                    && self._routePeriodRule !== null
                    && !Str.IsNullOrWhiteSpace(self._routePeriodRule.defaultData)) {
                    self._routePeriodHtmlData.value = RouteStore
                        .getOfficePasteControlHtmlData(self._routePeriodRule.defaultData);
                    return;
                } else {
                    self._routePeriodHtmlData.value = Str.Empty;
                    return;
                }
            }

            for (let index = 0; index < self._routeConfigRules.length; index++) {
                const valueIdentifier = self._routeHtmlData[index];
                const routeRule = self._routeConfigRules[index];

                if (valueIdentifier.id !== id
                    || routeRule.id !== id)
                    continue;

                valueIdentifier.value = RouteStore
                    .getOfficePasteControlHtmlData(routeRule.defaultData);
                return;
            }

            resolve();
        }).catch((error: Error) => {
            console.log(error.message);
            return;
        });
    }

    public get routeConfigRules(): IConfigRule[] {
        return Obj.clone(this._routeConfigRules);
    }

    public get routePeriodJson(): string[][] {
        const routePeriodData = RouteStore.getOfficePasteControlExcelData(this._routePeriodRule.defaultData);
        return routePeriodData || [];
    }

    public get routeJson(): string[][][] {
        const routeData: string[][][] = [];
        for (const rule of this._routeConfigRules) {
            routeData.push(RouteStore.getOfficePasteControlExcelData(rule.defaultData));
        }

        return routeData;
    }

    public get routePeriodHtmlData(): string {
        return this._routePeriodHtmlData.value;
    }

    public get routeHtmlData(): IValueIdentifier[] {
        return this._routeHtmlData;
    }

    private static getOfficePasteControlExcelData(data: string): string[][] {
        const jsonData: string[][] = [];

        if (Str.IsNullOrWhiteSpace(data)) {
            return jsonData;
        }

        const dataRows = data.split("\n");

        let i = 0;
        for (const dataRow of dataRows) {
            const cells = dataRow.split("\t");
            if (cells.length <= 0 || Str.IsNullOrWhiteSpace(cells[0])) continue;

            const rowArray = [];
            let isEmptyRow = true;
            let j = 0;

            for (const cell of cells) {
                const cellContents = (cell || Str.Empty).trim();
                if (
                    !Str.IsNullOrWhiteSpace(cellContents) &&
                    cellContents.toLowerCase() !== "route period" &&
                    cellContents.toLowerCase() !== "route from" &&
                    cellContents.toLowerCase() !== "route to"
                ) {
                    isEmptyRow = false;
                    rowArray[j++] = cellContents;
                }
            }

            if (!isEmptyRow) {
                jsonData[i++] = rowArray;
            }
        }

        return jsonData;
    }

    private static getOfficePasteControlHtmlData(data: string): string {
        const defaultValue = "<table class=\"table-center\" />";
        if (Str.IsNullOrWhiteSpace(data)) {
            return defaultValue;
        }

        const dataRows = data.split("\n");
        let table = "<table class=\"table-center\">";

        for (const dataRow of dataRows) {
            const cells = dataRow.split("\t");
            if (cells.length <= 0 || Str.IsNullOrWhiteSpace(cells[0])) continue;

            let row = "<tr>";
            let isEmptyRow = true;

            for (const cell of cells) {
                const cellContents = (cell || Str.Empty).trim();
                if (
                    !Str.IsNullOrWhiteSpace(cellContents) &&
                    cellContents.toLowerCase() !== "route period" &&
                    cellContents.toLowerCase() !== "route from" &&
                    cellContents.toLowerCase() !== "route to"
                ) {
                    isEmptyRow = false;
                    row += "<td>" + cell + "</td>";
                }
            }

            row += "</tr>";

            if (!isEmptyRow) {
                table += row;
            }
        }

        table += "</table>";

        return table;
    }
}
