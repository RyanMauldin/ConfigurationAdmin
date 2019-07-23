import Str from "./Str";

/**
 * This class has useful functions for comparing or cloning objects.
 *
 * ```typescript
 * // Usage:
 * import EnvHelper from "./EnvHelper";
 * this.setAutoPopulateTestValues(
 *     EnvHelper.getBoolean(process.env
 *       .VUE_APP_AUTO_POPULATE_TEST_VALUES as boolean)
 *   );
 * ```
 */
export default class EnvHelper {
    // tslint:disable-next-line
    // public static readonly OneBigInt: bigint = BigInt(1);
    // BigInt was not IE/Edge friendly, lol?

    // tslint:disable-next-line
    public static readonly LowerCaseTrue: string = "true";

    public static getBoolean(value?: any): boolean {
        if (typeof value === "undefined"
            || value === null) {
            return false;
        }

        if (typeof value === "boolean") {
            return value as boolean;
        }

        if (typeof value === "string") {
            return value.toLowerCase() === EnvHelper.LowerCaseTrue;
        }

        // BigInt was not IE/Edge friendly, lol?
        // if (typeof value === "bigint") {
        //     return value as bigint === EnvHelper.OneBigInt;
        // }

        if (typeof value === "number") {
            return value === 1;
        }

        return false;
    }

    public static getNumber(value?: any): number {
        if (typeof value === "undefined"
            || value === null) {
            return 0;
        }

        if (typeof value === "boolean") {
            return value === true
                ? 1
                : 0;
        }

        if (typeof value === "string") {
            try {
                return Number.parseFloat(value);
            }
            catch (err) {
                return 0;
            }
        }

        // BigInt was not IE/Edge friendly, lol?
        // if (typeof value === "bigint") {
        //     return value as bigint === EnvHelper.OneBigInt;
        // }

        if (typeof value === "number") {
            return value;
        }

        return 0;
    }
}
