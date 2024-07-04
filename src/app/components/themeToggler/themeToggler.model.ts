import { ThemeSwitcherService, ThemeSwitcherObserver } from "../../../shared/themeSwitcherService";
import { NonEmptyString } from "../../../utils/types";
import { Component, ComponentOptions } from "../component.model";
import { createElementHelperFn } from "../component.helpers";


type ThemeToggleComponentType = 'button-icon' | 'button-text' | 'checkbox';

export interface ThemeTogglerComponentOptions extends ComponentOptions {
    type?: ThemeToggleComponentType; // data-type
    togglerClass?: string; // data-toggler-class
    buttonIcon?: string; // data-button-icon
}

/**
 * Represents a theme toggler component that allows users to switch between light and dark themes.
 */
export class ThemeTogglerComponent extends Component implements ThemeSwitcherObserver {

    private divElement: HTMLDivElement;
    private switcher: ThemeSwitcherService;
    private type: ThemeToggleComponentType;
    private innerElement: HTMLElement;

    constructor(
        options: ThemeTogglerComponentOptions = {},
        element?: HTMLDivElement | NonEmptyString
    ) {
        const el = createElementHelperFn<HTMLDivElement>('div', element);
        super(options, el);
        this.divElement = el as HTMLDivElement;
        this.switcher = ThemeSwitcherService.getInstance()
        this.subscribeThemeSwitcher();
        this.type = options.type || 'button-icon';
        this.innerElement = this.createComponent(options);
        this.bindEvents();
    }

     subscribeThemeSwitcher(): void {
        this.switcher.addObserver(this);
    }

    private bindEvents(): void {
        switch (this.type) {
            case 'button-icon':
            case 'button-text':
                this.innerElement.addEventListener('click', () => {
                    this.switcher.switchTheme();
                });
                this.innerElement.title = this.setText();
                break;
            case 'checkbox':
                if (this.innerElement instanceof HTMLInputElement) {
                    this.innerElement.addEventListener('change', () => {
                        this.switcher.switchTheme();
                    });
                }
                break;
            default:
                throw new Error(`Unsupported type: ${this.type}`);
        }
    }

    updateElements(): void {
        switch (this.type) {
            case 'button-icon':
                this.innerElement.title = this.setText();
                break;
            case 'button-text':
                this.innerElement.textContent = this.setText();
                break;
            case 'checkbox':
                if (this.innerElement instanceof HTMLInputElement) {
                    this.innerElement.checked = this.switcher.getCurrentTheme() === 'dark';
                }
                break;
            default:
                throw new Error(`Unsupported type: ${this.type}`);

        }
    }

    private createComponent(options: ThemeTogglerComponentOptions): HTMLElement {
        let element: HTMLElement;

        switch (this.type) {
            case 'button-icon':
                element = document.createElement('button');
                (element as HTMLButtonElement).type = 'button';
                const icon = options.buttonIcon || '<span class="material-symbols-outlined">Contrast</span>';
                element.innerHTML = icon;
                element.title = this.setText();
                break;
            case 'button-text':
                element = document.createElement('button');
                (element as HTMLButtonElement).type = 'button';
                element.textContent = this.setText();
                break;
            case 'checkbox':
                const checked = this.switcher.getCurrentTheme() === 'dark';
                const elCheck = document.createElement('input') as HTMLInputElement;
                elCheck.type = 'checkbox';
                elCheck.checked = checked;
                element = elCheck;
                element.id = 'theme-toggler-checkbox';
                break;
            default:
                throw new Error(`Unsupported type: ${this.type}`);
        }

        const classOptions = options.togglerClass || '';
        if (classOptions) {
            element.classList.add(classOptions);
        }

        this.divElement.appendChild(element);

        if (this.type === 'checkbox') {
            const label = document.createElement('label');
            label.htmlFor = element.id;
            this.divElement.appendChild(label);
        }

        return element;
    }

    private setText(): string {
        return `Switch to ${this.switcher.getCurrentTheme() === 'light' ? 'dark' : 'light'} mode`;
    }

}