import { NonEmptyString } from "./types";

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isNonEmptyString(value: any): value is NonEmptyString {
    return isString(value) && value.length > 0;
}

export function isNumber(value: any): value is number {
    return typeof value === 'number';
}
