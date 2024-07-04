/**
 * Represents an observer that can be notified when the theme is switched.
 */
export interface ThemeSwitcherObserver {
    /**
     * Updates the elements affected by the theme switch.
     */
    updateElements(): void;
    
    subscribeThemeSwitcher(): void;

}

/**
 * Manages the switching of themes and notifies observers when the theme is changed.
 */
export class ThemeSwitcherService {

    private static instance: ThemeSwitcherService;

    private currentTheme: string;
    private storageKey: string;

    private observers: ThemeSwitcherObserver[];

    /**
     * Creates a new instance of ThemeSwitcher.
     * @param defaultTheme The default theme to use.
     * @param storageKey The key used to store the theme in local storage.
     */
    private constructor(defaultTheme: string = 'light', storageKey: string = 'theme') {
        this.storageKey = storageKey;
        this.currentTheme = this.loadTheme(defaultTheme);
        this.observers = [];
        this.applyTheme();
    }

    /**
     * Gets the singleton instance of ThemeSwitcher.
     * @param defaultTheme The default theme to use.
     * @param storageKey The key used to store the theme in local storage.
     * @returns The singleton instance of ThemeSwitcher.
     */
    static getInstance(defaultTheme: string = 'light', storageKey: string = 'theme'): ThemeSwitcherService {
        if (!ThemeSwitcherService.instance) {
            ThemeSwitcherService.instance = new ThemeSwitcherService(defaultTheme, storageKey);
        }
        return ThemeSwitcherService.instance;
    }

    /**
     * Switches the current theme between light and dark.
     */
    switchTheme(): void {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        this.notifyObservers();
    }

    /**
     * Gets the current theme.
     * @returns The current theme.
     */
    getCurrentTheme(): string {
        return this.currentTheme;
    }

    private applyTheme(): void {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    private loadTheme(defaultTheme: string): string {
        const savedTheme = localStorage.getItem(this.storageKey);
        if (savedTheme) {
            return savedTheme;
        }
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDarkScheme ? 'dark' : defaultTheme;
    }

    private saveTheme(): void {
        localStorage.setItem(this.storageKey, this.currentTheme);
    }

    /**
     * Adds an observer to be notified when the theme is switched.
     * @param observer The observer to add.
     */
    addObserver(observer: ThemeSwitcherObserver): void {
        this.observers.push(observer);
    }

    /**
     * Removes an observer from the list of observers.
     * @param observer The observer to remove.
     */
    removeObserver(observer: ThemeSwitcherObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    private notifyObservers(): void {
        this.observers.forEach(observer => {
            observer.updateElements();
        });
    }

}