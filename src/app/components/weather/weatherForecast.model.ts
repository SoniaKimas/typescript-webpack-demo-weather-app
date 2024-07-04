import { Coords, NonEmptyString } from "../../../utils/types";
import { Component, ComponentOptions, InitializableComponent } from "../component.model";
import { createElementHelperFn } from "../component.helpers";
import { getTomorrowioForecastData } from "../../api/tomorrowio.weather.forecast.get";
import { ForecastWeatherData } from "../../api/tomorrowio.weather.forecast.data.model";
import { convertMSToKMH, getShortDayOfWeek } from "../../helpers/helper.fns";

export interface WeatherForecastComponentOptions extends ComponentOptions {
}

/**
 * Represents a weather forecast component.
 */
export class WeatherForecastComponent extends Component implements InitializableComponent {
    private divElement: HTMLDivElement;

    /**
     * Creates an instance of WeatherForecastComponent.
     * @param coords - The coordinates for the weather forecast.
     * @param options - The options for the weather forecast component.
     * @param element - The HTML element to attach the weather forecast component or the selector for the element.
     */
    constructor(
        private coords: Coords,
        options: WeatherForecastComponentOptions = {},
        element?: HTMLDivElement | NonEmptyString
    ) {
        const el = createElementHelperFn<HTMLDivElement>('div', element);
        super(options, el);
        this.divElement = el as HTMLDivElement;
    }

    /**
     * Initializes the weather forecast component.
     * @returns A promise that resolves when the initialization is complete.
     * @throws If there is an error initializing the component.
     */
    async initialize(): Promise<void> {
        try {
            const forecast = await getTomorrowioForecastData<ForecastWeatherData>(this.coords.lat, this.coords.lng);

            this.divElement.innerHTML = '';
            this.divElement.classList.add('card-content');

            let daysdata = forecast.timelines.daily;

            let uList = this.divElement.appendChild(document.createElement('ul'));
            uList.classList.add('wt-UListCards', 'card-body-row');

            daysdata.forEach(element => {
                const { time, values } = element;
                const { temperatureAvg, precipitationProbabilityAvg, windSpeedAvg } = values;

                const weatherDayData: WeatherDayData = {
                    date: getShortDayOfWeek(time.slice(0, 10)),
                    temperature: Math.round(temperatureAvg as number),
                    rain: precipitationProbabilityAvg as number,
                    wind: convertMSToKMH(windSpeedAvg as number)
                };

                new WeatherCard(uList, weatherDayData);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}



class WeatherCard {

    private materialSpanClass = 'material-symbols-outlined';

    constructor(
        private weatherDataDisplayUl: HTMLUListElement,
        private weatherDayInfo: WeatherDayData,

    ) { this.render(); }

    private render(): void {
        let li = this.createWeatherCardElement();

        let dateDive = li.appendChild(document.createElement('div'));
        dateDive.classList.add('wt-cardDate');
        dateDive.textContent = `${this.weatherDayInfo.date}`;

        this.createWeatherCardPair(li, 'thermostat', 'Temperature', `${this.weatherDayInfo.temperature}°C`);
        this.createWeatherCardPair(li, 'rainy', 'Precipitation', `${this.weatherDayInfo.rain}%`);
        this.createWeatherCardPair(li, 'air', 'Wind', `${this.weatherDayInfo.wind} Km/h`);
    }

    private createWeatherCardElement(): HTMLLIElement {
        let li = this.weatherDataDisplayUl.appendChild(document.createElement('li'));
        li.classList.add('wt-card');
        return li;
    }

    private createWeatherCardPair(li: HTMLLIElement, icon: string, title: string, text: string): void {
        let pair = li.appendChild(document.createElement('div'));
        pair.className = 'wt-cardPair';
        pair.title = title;
        let span = pair.appendChild(document.createElement('span'));
        span.className = this.materialSpanClass;
        span.textContent = icon;
        let divContent = pair.appendChild(document.createElement('div'))
        divContent.textContent = text;
        divContent.className = 'wt-cardPairText';

    }

}

type WeatherDayData = {
    date: string;
    temperature: number;
    rain: number;
    wind: number;
}
