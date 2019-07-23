import Str from "./Str";

/**
 * This class has useful functions for comparing or cloning objects.
 *
 * ```typescript
 * // Usage:
 * imoprt Str from "./Str";
 * import Obj from "./Obj";
 * import { IConfigRule } from "./IConfigRule";
 * const configRule = { id: "5", title: "Original Rule" } as IConfigRule;
 * const configRuleClone = Obj.clone(configRule);
 * configRuleClone.title = Str.Empty;
 * configRuleClone.title = Obj.applyStrings(configRule.title, configRuleClone.title);
 * ```
 */
export default class Obj {
    public static forceValue(value: any): any {
        return value || null;
    }

    public static applyValues(value: any, fallbackValue: any): any {
        const forcedValue = this.forceValue(value);
        if (forcedValue != null)
            return forcedValue;

        const forcedFallbackValue = this.forceValue(fallbackValue);
        return forcedFallbackValue;
    }

    public static forceString(value: string): string {
        return Str.IsNullOrWhiteSpace(value)
            ? Str.Empty
            : value.trim();
    }

    public static applyStrings(value: string, fallbackValue: string): string {
        const forcedValue = this.forceString(value);
        if (!Str.IsNullOrWhiteSpace(forcedValue))
            return forcedValue;

        const forcedFallbackValue = this.forceString(fallbackValue);
        return forcedFallbackValue;
    }

    // Clone object: example adapted from: https://stackoverflow.com/questions/28150967/typescript-cloning-object
    public static clone(obj: any): any {
        // Do not work with or return null...
        if (obj === null) {
            return undefined;
        }

        // ByPass undefined, class or function definitions, string and value types.
        switch (typeof obj) {
            case "undefined":
            case "string":
            case "boolean":
            case "number":
            case "function":
                return obj;
        }

        // cannot clone well.
        if (obj instanceof Function
            || obj instanceof RegExp) {
            return obj;
        }

        let copy: any;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = this.clone(obj[attr]);
                }
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}

// var clone = <Customer>deepCopy(customer);
