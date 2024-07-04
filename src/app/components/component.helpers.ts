import { isNonEmptyString } from "../../utils/typeGuards";
import { NonEmptyString } from "../../utils/types";

/**
 * Creates an HTML element of type T.
 * @param tag The HTML tag name of the element to create. Defaults to 'div'.
 * @param element The element or ID of the element to use as the base for creating the new element.
 * @returns The created HTML element of type T.
 * @throws Error if the provided element is invalid or not found.
 */
export function createElementHelperFn<T extends HTMLElement>
        ( tag :string = 'div', element?: T | NonEmptyString  ): T {

    let el: T | null = null;

    // ==null checks null and undefined
    if (element == null) {

        el = document.createElement(tag) as T;

    } else if (isNonEmptyString(element)) {

        const foundElement = document.getElementById(element);
        if (foundElement && foundElement instanceof HTMLElement) {
            el = foundElement as T;
        } else {
            throw new Error(`Element with id "${element}" not found or not an HTMLElement.`);
        }

    } else if (element instanceof HTMLElement) {
        el = element;
    } else {
        throw new Error('Invalid element provided.');
    }

    return el;
}
