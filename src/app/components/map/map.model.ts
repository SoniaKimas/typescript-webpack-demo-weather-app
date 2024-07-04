
import { getConfig } from "../../../config/config";
import { ThemeSwitcherObserver, ThemeSwitcherService } from "../../../shared/themeSwitcherService";
import { Coords, NonEmptyString } from "../../../utils/types";
import { Component, ComponentOptions, InitializableComponent } from "../component.model";
import { createElementHelperFn } from "../component.helpers";


export interface MapComponentOptions extends ComponentOptions {
    markerTitle?: string,
}

/**
 * Represents a map component that displays a map with a marker.
 */
export class MapComponent extends Component implements InitializableComponent, ThemeSwitcherObserver {
    private switcher: ThemeSwitcherService;
    private divElement: HTMLDivElement;
    private map: google.maps.Map | null = null;
    private marker: google.maps.marker.AdvancedMarkerElement | null = null;
    private markerTitle: string | null = null;

    /**
     * Creates an instance of MapComponent.
     * @param coords - The coordinates of the map center.
     * @param onDragEnd - The callback function to be called when the marker is dragged to a new position.
     * @param options - The options for the map component.
     * @param element - The HTML element or selector string representing the container element for the map.
     */
    constructor(
        private coords: Coords,
        private onDragEnd: (newCoords: Coords) => void,
        options: MapComponentOptions = {},
        element?: HTMLDivElement | NonEmptyString
    ) {
        const el = createElementHelperFn<HTMLDivElement>('div', element);
        super(options, el);
        this.divElement = el as HTMLDivElement;

        this.markerTitle = options.markerTitle || this.divElement.getAttribute('data-marker-title') || null;

        this.switcher = ThemeSwitcherService.getInstance();
        this.subscribeThemeSwitcher();
    }

    /**
     * Updates the elements of the map component based on the current theme.
     */
    updateElements(): void {
        if (this.switcher.getCurrentTheme() === 'dark') {
            this.divElement.style.filter = `brightness(0.75) contrast(1.3)`;
        } else {
            this.divElement.style.filter = `brightness(1) contrast(1)`;
        }
    }

    /**
     * Subscribes the map component to the theme switcher service.
     */
    subscribeThemeSwitcher(): void {
        this.switcher.addObserver(this);
    }

    /**
     * Initializes the map component by creating the map and marker elements.
     * @returns A promise that resolves when the map component is initialized.
     * @throws An error if the map component fails to initialize.
     */
    async initialize(): Promise<void> {
        this.updateElements();
        try {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

            this.map = new Map(this.divElement, {
                zoom: 8,
                center: this.coords,
                mapId: getConfig().GOOGLE_MAP_ID
            });

            this.marker = new AdvancedMarkerElement({
                map: this.map,
                position: this.coords,
                title: this.markerTitle ?? `${this.coords.lat}, ${this.coords.lng}`,
                gmpDraggable: true,
            });
            this.addMarkerListeners();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Adds event listeners to the marker element.
     */
    private addMarkerListeners(): void {
        if (!this.marker) return;

        this.marker.addListener('click', () => {
            this.map?.setZoom(11);
        });

        this.marker.addListener('dragend', () => {
            const position = this.marker?.position as Coords;
            if (position) {
                this.onDragEnd(position);
            }
        });
    }
}
