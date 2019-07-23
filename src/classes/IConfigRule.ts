/**
 * This interface is used in the Store to drive the number
 * of configuration rules per Route Period.
 *
 * ```typescript
 * // Usage:
 * imoprt Str from "./Str"
 * import Obj from "./Obj";
 * const configRule = { id: "5", title: "Original Rule" } as IConfigRule;
 * const configRuleClone = Obj.clone(configRule);
 * configRuleClone.title = Str.Empty
 * configRuleClone.title = Obj.applyStrings(configRule.title, configRuleClone.title)
 * ```
 */
export interface IConfigRule {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    defaultData: string;
}


