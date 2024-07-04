import { NonEmptyString } from '../../../utils/types';
import { Component, ComponentOptions } from '../component.model';
import { createElementHelperFn } from '../component.helpers';

export interface SearchComponentOptions extends ComponentOptions {
    name?: string; // data-name
    buttonClass?: string; // data-button-class
    buttonTitle?: string; // data-button-title
    inputClass?: string; // data-input-class
    inputPlaceholder?: string; // data-input-placeholder
    inputName?: string; // data-input-name
}

/**
 * Represents a search component.
 */
export class SearchComponent extends Component {
    private formElement: HTMLFormElement;
    private inputElement: HTMLInputElement;
    private buttonElement: HTMLButtonElement;

    /**
     * Creates an instance of SearchComponent.
     * @param options - The options for the search component.
     * @param element - The HTML form element or a selector for the form element.
     */
    constructor(
        options: SearchComponentOptions = {},
        element?: HTMLFormElement | NonEmptyString 
    ) {
        const el = createElementHelperFn<HTMLFormElement>( 'form', element);
        super(options , el);
        this.formElement = el as HTMLFormElement;
        this.inputElement = this.formElement.appendChild(document.createElement('input'));
        this.buttonElement = this.formElement.appendChild(document.createElement('button'));

        const formClass = options.class || this.formElement.getAttribute('data-class') ;
        if (!formClass) {
            this.setFormDefaultStyles();
        } 

        const inputClass = options.inputClass || this.formElement.getAttribute('data-input-class');
        if (!inputClass) {
            this.setInputDefaultStyles();
        } else {
            this.inputElement.classList.add(inputClass);
        }

        const buttonClass = options.buttonClass || this.formElement.getAttribute('data-button-class');
        if (!buttonClass) {
            this.setButtonDefaultStyles();
        } else {
            this.buttonElement.classList.add(buttonClass);
        } 

        const inputPlaceholder = options.inputPlaceholder || this.formElement.getAttribute('data-input-placeholder') || 'Search';
        if (inputPlaceholder) {
            this.inputElement.placeholder = inputPlaceholder;
        }
        this.inputElement.type = 'text';
        this.inputElement.autocomplete = 'off';
        this.inputElement.addEventListener('input', this.checkFormValidity.bind(this));

        this.buttonElement.innerHTML = '<span class="material-symbols-outlined">search</span>';
        this.buttonElement.type = 'submit';
        this.buttonElement.disabled = true;
    }


    submitForm() {
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.emit<string>('search', this.inputElement.value);
        });
    }


    set inputText(value: string) {
        this.inputElement.value = value;
        this.checkFormValidity();
    }

    private checkFormValidity() {
        if (this.formElement.checkValidity() && this.inputElement!.value.trim().length > 0) {
            this.buttonElement.disabled = false;
        } else {
            this.buttonElement.disabled = true;
        }
    }

    private setFormDefaultStyles() {
        this.formElement.style.display = 'flex';
        this.formElement.style.border = '1px solid lightgray';
        this.formElement.style.justifyContent = 'center';
    }

    private setInputDefaultStyles() {
        this.inputElement.style.background = 'none';
        this.inputElement.style.border = 'none';
        this.inputElement.style.outline = 'none';
    }

    private setButtonDefaultStyles() {
        this.buttonElement.style.border = 'none';
        this.buttonElement.style.outline = 'none';
    }
}