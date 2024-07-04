import { Coords, NonEmptyString } from "../../../utils/types";
import { RealtimeWeatherData } from "../../api/tomorrowio.weather.realtime.data.model";

import { Component, ComponentOptions, InitializableComponent } from "../component.model";
import { createElementHelperFn } from "../component.helpers";
import { getTomorrowioRealtimeData } from "../../api/tomorrowio.weather.realtime.get";
import { convertMSToKMH } from "../../helpers/helper.fns";

export interface WeatherRealTimeComponentOptions extends ComponentOptions {
    
}

/**
 * Represents the WeatherRealTimeComponent class.
 * This component displays real-time weather information.
 */
export class WeatherRealTimeComponent extends Component
implements InitializableComponent {

    private divElement: HTMLDivElement; 

    /**
     * Constructs a new instance of the WeatherRealTimeComponent class.
     * @param coords - The coordinates of the location.
     * @param options - The options for the component.
     * @param element - The HTML element to attach the component or the selector for the element.
     */
    constructor(
        private coords: Coords,
        options: WeatherRealTimeComponentOptions = {},
        element?: HTMLDivElement | NonEmptyString 
    ) {
        const el = createElementHelperFn<HTMLDivElement>( 'div', element);
        super(options , el);
        this.divElement = el as HTMLDivElement;
    }

    /**
     * Initializes the WeatherRealTimeComponent.
     * @returns A promise that resolves when the component is initialized.
     * @throws If there is an error initializing the component.
     */
    async initialize(): Promise<void> {

        try {
            const realtime = await getTomorrowioRealtimeData<RealtimeWeatherData>(this.coords.lat, this.coords.lng);

            this.divElement.innerHTML = '';
            this.divElement.innerHTML = `
                <div>
                    <span>${realtime.data.time.slice(11, 16)}</span><br>
                </div>
                <div class="card-body-row">
                    <div class="weather-realtime-info-pair" title="Temperature">
                        <span class="material-symbols-outlined">thermostat</span>
                        <span>${ Math.round(realtime.data.values.temperature)}°C</span>
                    </div>
                    <div class="weather-realtime-info-pair" title="Precipitation Probability">
                        <span class="material-symbols-outlined">rainy</span>
                        <span>${realtime.data.values.precipitationProbability} %</span>
                    </div>
                    <div class="weather-realtime-info-pair" title="Wind Speed">
                        <span class="material-symbols-outlined">air</span>
                        <span>${convertMSToKMH(realtime.data.values.windSpeed)} km/h</span>
                    </div>
                    <div class="weather-realtime-info-pair" title="Humidity">
                        <span class="material-symbols-outlined">humidity_percentage</span>
                        <span>${realtime.data.values.humidity} %</span>
                    </div>
                    <div class="weather-realtime-info-pair" title="Cloud Cover">
                        <span class="material-symbols-outlined">cloud</span>
                        <span>${realtime.data.values.cloudCover} %</span>
                    </div>
                </div>
            `;


        } catch (error) {
            console.error(error);
            throw error;
        }

    }
}
