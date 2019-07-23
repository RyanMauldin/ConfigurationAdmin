/**
 * This module introduces some C# .NET Style String functionality.
 *
 * ```typescript
 * // Usage:
 * import Str from "./Str";
 * if (Str.IsNullOrWhiteSpace(value)) {
 *     value = Str.Empty;
 * }
 * ```
 */
export default class Str {
    // ReSharper disable once InconsistentNaming
    // tslint:disable-next-line
    public static readonly Empty: string = "";

    // ReSharper disable once InconsistentNaming
    // tslint:disable-next-line
    public static IsNullOrEmpty(value: string | undefined | null): boolean {
        return typeof value === "undefined"
            || value == null
            || value.length <= 0;
    }

    // ReSharper disable once InconsistentNaming
    // tslint:disable-next-line
    public static IsNullOrWhiteSpace(value: string | undefined | null): boolean {
        return typeof value === "undefined"
            || value == null
            || value.length <= 0
            || value.trim().length <= 0;
    }
}
