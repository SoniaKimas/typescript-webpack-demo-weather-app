import './styles.scss';
import { countryFlagComponentFn } from './app/components/country/countryflag.fn';
import { SearchComponent } from './app/components/search/search.model';
import { searchAddressOptions } from './app/components/search/search.options';
import { ThemeTogglerComponent } from './app/components/themeToggler/themeToggler.model';
import { themeToggleOptionsIcon, themeToggleOptionsTxt } from './app/components/themeToggler/themeToggler.options';
import { MapComponent } from './app/components/map/map.model';
import { WeatherRealTimeComponent } from './app/components/weather/weatherRealtime.model';
import { NonEmptyString } from './utils/types';
import { getAddressGeoData } from './app/helpers/google.geocode.get.mapped';
import { WeatherForecastComponent } from './app/components/weather/weatherForecast.model';
import { countryImagesComponentFn } from './app/components/country/countryImages.fn';
import { addressComponentFn } from './app/components/address/address.fn';

const appHeader = document.getElementById('app-header')! as HTMLDivElement;
const appFooter = document.getElementById('app-footer')! as HTMLDivElement;
const addressDisplay = document.getElementById('address-display')! as HTMLDivElement;
const countryImages = document.getElementById('country-images')! as HTMLDivElement

const search = new SearchComponent(searchAddressOptions);
search.appendTo(appHeader);

(new ThemeTogglerComponent(themeToggleOptionsIcon)).appendTo(appHeader);
(new ThemeTogglerComponent(themeToggleOptionsTxt)).appendTo(appFooter);


async function renderInfoHandler(searchValue: string) {
    const enteredAddress = searchValue;

    const handleNewCoords = (newCoords: { lat: number, lng: number }) => {
        search.inputText = `${newCoords.lat}, ${newCoords.lng}`;
    };

    try {

        const addressInfos = await getAddressGeoData(enteredAddress);

        addressComponentFn(addressDisplay, addressInfos);

        const mapComp = new MapComponent(addressInfos.coords, handleNewCoords, {}, "map" as NonEmptyString);
        await mapComp.initialize();

        const weatherRealTime = new WeatherRealTimeComponent(addressInfos.coords, {}, "realtime" as NonEmptyString);
        const weatherForecast = new WeatherForecastComponent(addressInfos.coords, {}, "forecast" as NonEmptyString);
        await Promise.all([
            weatherRealTime.initialize(),
            weatherForecast.initialize()
        ]);


        if (addressInfos.country) {
            countryImages.innerHTML = '';
            await countryFlagComponentFn(
                countryImages,
                {
                    code: addressInfos.country?.short_name,
                    name: addressInfos.country?.long_name
                }
            );
            await countryImagesComponentFn(
                countryImages,
                {
                    code: addressInfos.country?.short_name,
                    name: addressInfos.country?.long_name
                }
            );

        }

    } catch (err) {
        console.error(err);
        throw err
    }
}


window.addEventListener('DOMContentLoaded', () => {
    if (search !== null) {
        search.on('search', async (searchTerm: string) => {
            try {
                await renderInfoHandler(searchTerm);
            } catch (err) {
                alert('Error handling search');
                console.error('Error handling search:', err);
            }
        });
        search.submitForm();
    }
});