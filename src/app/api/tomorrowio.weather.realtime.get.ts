import { getConfig } from "../../config/config";
import { RealtimeWeatherData } from "./tomorrowio.weather.realtime.data.model";


/**
 * Retrieves real-time weather data from the Tomorrow.io API.
 * 
 * @param lat - The latitude of the location.
 * @param lng - The longitude of the location.
 * @returns A promise that resolves to the real-time weather data.
 * @throws An error if there is an HTTP error or if the API response has an invalid data structure.
 */
export async function getTomorrowioRealtimeData<T extends RealtimeWeatherData>( lat:number, lng :number): Promise<T> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    const endpoint = `https://api.tomorrow.io/v4/weather/realtime`;


    try {
        const response = await fetch(`${endpoint}?location=${lat},${lng}&apikey=${getConfig().TOMORROWIO_API_KEY}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const wData = await response.json();

        // Assuming data structure from the API response
        if (!wData.data) {
            throw new Error('Invalid data structure from API response');
        }

        return wData as T;


    } catch (err) {
        console.error('Error fetching weather information:', err);
        throw err;
    }
}
