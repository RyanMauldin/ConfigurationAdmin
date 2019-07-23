import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Obj from "../classes/Obj";
import EnvHelper from "../classes/EnvHelper";

/**
 * This class is used as a Store Module that will be pulled into the Root Vue component,
 * for global shared state and inter component communication.
 *
 * ```typescript
 * // Usage: <./Store.ts>
 * import RouteStore from "./store/RouteStore";
 * import SpinnerStore from "./store/SpinnerStore";
 * import TestValueStore from "./store/TestValueStore";
 * Vue.use(Vuex);
 * const store = new Vuex.Store({ state: {}, modules: { RouteStore, SpinnerStore, TestValueStore } });
 * export default store;
 * // Usage: <./main.ts>
 * import store from "./store";
 * new Vue({ router, store, render: h => h(App) }).$mount("#app");
 * // Usage: <./App.vue>
 * public spinnerActive(): boolean { return this.$store.getters.spinnerActive; }
 * // and...
 * <div class="admin-spinner" v-show="spinnerActive()">
 *   <b-spinner variant="text-light"></b-spinner>
 * </div>
 * // and every other component method in all your components...
 * this.$store.commit("pingSpinner", true);
 * ```
 */
@Module({ name: "SpinnerStore" })
export default class SpinnerStore extends VuexModule {
    // https://github.com/nodejs/node-v0.x-archive/issues/3605
    // "It seems that setTimeout internally uses a signed 32 bit integer to represent
    // the number of milliseconds to "sleep", giving a maximum delay of 2147483647 ms,
    // about 24.9 days." ... so let's not go over that for our own set
    private _spinnerMaxTimeout: number = 2147483647;
    private _spinnerDefaultTimeout: number = 1500;
    private _spinnerTimeout: number = 1500;
    private _isSpinnerActive: boolean = false;
    private _setTimeoutHandle?: number = undefined;

    @Mutation
    public configureSpinnerTimeout(timeOutInMilliseconds?: number): void {
        // try to lose object reference with clone in case user tries to inject
        // a referenced value.
        const timeOutInMillisecondsClone: number = EnvHelper.getNumber(
            Obj.clone(timeOutInMilliseconds));
        // If the user provided a value less than 1, try to pull it from the default
        // Environmental variable location VUE_APP_SPINNER_TIMEOUT_IN_MILLISECONDS, otherwise
        // set it back to the default value.
        if (timeOutInMillisecondsClone < 1) {
            // User did not provide a big value, meaning they may want to read from config,
            // or use the module default value.
            let spinnerTimeout: number = 0;
            spinnerTimeout = EnvHelper.getNumber(process.env
                .VUE_APP_SPINNER_TIMEOUT_IN_MILLISECONDS as string);

            // If there is no valid configuration value, use module default.
            if (spinnerTimeout < 1) {
                // Could not pull a useful timeout value from config file,
                // Go with our module default.
                this._spinnerTimeout = this._spinnerDefaultTimeout;
                return;
            }
            else if (spinnerTimeout > this._spinnerMaxTimeout) {
                // Let's just throw an exception so the user will know something
                // is up if they go over our biggest timeout value possible. It
                // could cause them to develop an application error down the road
                /// otherwise as too big a value eventually crashes setTimeout.
                throw new Error(
                    `timeOutInMilliseconds configuration value for SpinnerStore cannot exceed:`
                    + `${this._spinnerMaxTimeout}`
                );
            }
            else {
                // Attempt to use configuration value from the config file,
                // as it seems in the correct range.
                this._spinnerTimeout = spinnerTimeout;
                return;
            }
        }
        else if (timeOutInMillisecondsClone > this._spinnerMaxTimeout) {
            // Let's just throw an exception so the user will know something
            // is up if they go over our biggest timeout value possible. It
            // could cause them to develop an application error down the road
            /// otherwise as too big a value eventually crashes setTimeout.
            throw new Error(
                `timeOutInMilliseconds configuration value for SpinnerStore cannot exceed:`
                + `${this._spinnerMaxTimeout}`
            );
        }
        else {
            // Attempt to use the user provided configuration value,
            // as it seems in the correct range.
            this._spinnerTimeout = timeOutInMillisecondsClone;
            return;
        }
    }

    @Mutation
    public cancelSpinner(): void {
        this._isSpinnerActive = false;
        if (typeof this._setTimeoutHandle === "number") {
            window.clearTimeout(this._setTimeoutHandle);
        }

        this._setTimeoutHandle = undefined;
    }

    @Mutation
    public pingSpinner(): void {
        this._isSpinnerActive = false;
        if (typeof this._setTimeoutHandle === "number") {
            window.clearTimeout(this._setTimeoutHandle);
        }

        this._setTimeoutHandle = undefined;

        this._isSpinnerActive = true;

        const self = this;
        this._setTimeoutHandle = setTimeout(() => {
            self._isSpinnerActive = false;
            window.clearTimeout(self._setTimeoutHandle);
            self._setTimeoutHandle = undefined;
            return;
        }, this._spinnerTimeout);
    }

    @Action({ commit: "configureSpinnerTimeout" })
    public configureSpinnerTimeoutCommit(timeOutInMilliseconds?: number): number {
        return typeof timeOutInMilliseconds === "undefined"
            || timeOutInMilliseconds === null
            ? 0
            : timeOutInMilliseconds;
    }

    @Action({ commit: "cancelSpinner" })
    public cancelSpinnerCommit(): void {
        return;
    }

    @Action({ commit: "pingSpinner" })
    public pingSpinnerCommit(): void {
        return;
    }

    public get isSpinnerActive(): boolean {
        return this._isSpinnerActive;
    }
}
