/**
 * This interface is used in the Store to drive html values, etc.
 *
 * ```typescript
 * // Usage:
 * const configRule = { id: "5", title: "<html></html>" } as IValueIdentifier;
 * ```
 */
export interface IValueIdentifier {
    id: string;
    value: string;
}
