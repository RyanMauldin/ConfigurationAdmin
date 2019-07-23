import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Obj from "../classes/Obj";
import Str from "../classes/Str";

/**
 * This class is used as a Store Module that will be pulled into the Root Vue component,
 * for global shared state and inter component communication.
 *
 * ```typescript
 * // Usage: <./Store.ts>
 * import TestValueStore from "./store/TestValueStore";
 * Vue.use(Vuex);
 * const store = new Vuex.Store({ state: {}, modules: { RouteStore, TestValueStore } });
 * export default store;
 * // Usage: <./main.ts>
 * import store from "./store";
 * new Vue({ router, store, render: h => h(App) }).$mount("#app");
 * // Usage: <./RouteXmlGenerator.vue>
 * public getRoutePeriodTestValue(): string { return this.$store.routePeriodTestValue; }
 * ```
 */
@Module({ name: "TestValueStore" })
export default class TestValueStore extends VuexModule {
    private _autoPopulateTestValues: boolean = false;
    private _routePeriodTestValue: string = Str.Empty;
    private _routeTestValues: string[] = [];

    @Mutation
    public config(): void {
        if (this._autoPopulateTestValues === true) {
            this._routePeriodTestValue = TestValueStore._routePeriodValue;
            const values: string[] = [];
            values.push(TestValueStore._routeValue1);
            values.push(TestValueStore._routeValue2);
            this._routeTestValues = values;
        }
        else {
            this._routePeriodTestValue = Str.Empty;
            this._routeTestValues = [];
        }
    }

    @Mutation
    public setAutoPopulateTestValues(value: boolean): void {
        const valueClone: boolean = Obj.clone(value);
        this._autoPopulateTestValues = valueClone;
    }

    @Action({ commit: "config" })
    public configCommit(): void {
        return;
    }

    @Action({ commit: "setAutoPopulateTestValues" })
    public setAutoPopulateTestValuesCommit(value: boolean): boolean {
        return value;
    }

    public get autoPopulateTestValues(): boolean {
        if (typeof this._autoPopulateTestValues === "undefined"
            || this._autoPopulateTestValues === null) {
            return false;
        }

        return Obj.clone(this._autoPopulateTestValues);
    }

    public set autoPopulateTestValues(value: boolean) {
        if (typeof value === "undefined"
            || value === null) {
            this._autoPopulateTestValues = false;
        }
        else {
            this._autoPopulateTestValues = Obj.clone(value);
        }
    }

    public get routePeriodTestValue(): string {
        if (!this._autoPopulateTestValues)
            return Str.Empty;

        return Obj.clone(this._routePeriodTestValue);
    }

    public set routePeriodTestValue(value: string) {
        if (typeof value === "undefined"
            || Str.IsNullOrWhiteSpace(value)) {
            this._routePeriodTestValue = Str.Empty;
        }
        else {
            this._routePeriodTestValue = Obj.clone(value);
        }
    }

    public get routeTestValues(): string[] {
        if (!this._autoPopulateTestValues)
            return [];

        return Obj.clone(this._routeTestValues);
    }

    public set routeTestValues(value: string[]) {
        if (typeof value === "undefined"
            || value.length === 0) {
            this.routeTestValues = [];
        } else {
            this._routeTestValues = Obj.clone(value);
        }
    }

    private static readonly _routePeriodValue: string = `
ROUTE PERIOD
18JAN-13APR18
12MAY-13JUL18

`;

    private static readonly _routeValue1: string = `
Route From	 	Route To
Target	to/from	Starbucks
Starbucks	to/from	Work
Work	to/from	Starbucks
Starbucks	to/from	Target

`;

    private static readonly _routeValue2: string = `
Route From	 	Route To
Work	to/from	Home
Home	to/from	Target
Target	to/from	Home
Home	to/from	Work

`;
}
