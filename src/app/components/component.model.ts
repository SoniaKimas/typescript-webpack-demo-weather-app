import EventEmitter from "events";
import { isNonEmptyString } from "../../utils/typeGuards";


export interface InitializableComponent {
    initialize(): Promise<void> ;
}

export interface ComponentOptions {
    class?: string; // data-class
}

/**
 * Represents a base component that can be extended to create custom components.
 */
/**
 * Represents an abstract component that can be extended to create custom components.
 * @extends EventEmitter
 */
export abstract class Component extends EventEmitter {
    protected htmlElement: HTMLElement;

    /**
     * Creates a new instance of the Component class.
     * @param options - The options for the component.
     * @param element - The HTML element or the ID of the element to associate with the component.
     */
    protected constructor(
        options: ComponentOptions = {},
        element: HTMLElement | string
    ) {
        console.log(options.class);
        super();

        if (element instanceof HTMLElement) {
            this.htmlElement = element;
        } else {
            this.htmlElement = document.getElementById(element)! as HTMLElement;
        }

        const formClass = options.class ?? this.htmlElement.getAttribute('data-class');
        if (isNonEmptyString(formClass)) {
            this.htmlElement.classList.add(formClass);
        }

        this.htmlElement.innerHTML = '';
    }

    /**
     * Appends the HTML element of this component to the specified element.
     * @param element - The element to which the HTML element will be appended.
     */
    appendTo(element: HTMLElement) :void {
        element.appendChild(this.htmlElement);
    }


    /**
     * Prepends the HTML element of this component to the specified element.
     * 
     * @param element - The element to which the HTML element should be prepended.
     * 
     */
    prependTo(element: HTMLElement): void {
        try {
            element.prepend(this.htmlElement); 
        } catch (error) {
            console.error(error);
            throw error;
        } 
    }

    /**
     * Removes the HTML element of this component from the DOM.
     */
    remove(): void {
        this.htmlElement.remove();
    }

    /**
     * Adds a CSS class to the HTML element of this component.
     * @param className - The class name to add.
     */
    addClass(className: string): void {
        this.htmlElement.classList.add(className);
    }

    /**
     * Removes a CSS class from the HTML element of this component.
     * @param className - The class name to remove.
     */
    removeClass(className: string): void {
        this.htmlElement.classList.remove(className);
    }

    /**
     * Toggles a CSS class on the HTML element of this component.
     * @param className - The class name to toggle.
     */
    toggleClass(className: string) {
        this.htmlElement.classList.toggle(className);
    }

    /**
     * Gets the class list of the HTML element of this component.
     */
    get classList(): DOMTokenList{
        return this.htmlElement.classList;
    }

}

