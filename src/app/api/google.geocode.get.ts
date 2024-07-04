import axios from "axios";
import { getConfig } from "../../config/config";
import { GoogleGeocodingResponse } from "./google.geocode.data.model";


/**
 * Retrieves geocode data from the Google Geocoding API based on the provided address.
 * @param address - The address to retrieve geocode data for.
 * @returns A promise that resolves to the geocode data.
 * @throws An error if the location could not be fetched.
 */
export async function getGeocodeData<T extends GoogleGeocodingResponse>(address: string): Promise<T> {

    try {
        const response = await axios.get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${getConfig().GOOGLE_API_KEY}`
        );

        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location!');
        }

        return response.data as T;

    } catch (err) {
        console.error(err);
        throw err;
    }
}

