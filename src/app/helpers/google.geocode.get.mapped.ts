import { AddressComponent, AddressResponse } from "../api/google.geocode.data.model";
import { getGeocodeData } from "../api/google.geocode.get";

function getInfoFromAddressComponents(addressComponents:  AddressComponent[], componentType: string): AddressComponent | null {
    for (const component of addressComponents) {
        if (component.types.includes(componentType)) {
            return component;
        }
    }
    return null;
}

interface AddressInfoResult {
    coords: { lat: number, lng: number };
    formattedAddress: string;
    place_id: string;
    country?: { long_name: string, short_name: string };
    locality?: { long_name: string, short_name: string };
}


/**
 * Retrieves the geolocation data for a given address.
 * @param address The address to retrieve geolocation data for.
 * @returns A promise that resolves to the geolocation data for the address.
 * @throws If an error occurs while retrieving the geolocation data.
 */
export async function getAddressGeoData(address: string): Promise<AddressInfoResult> {

    try {
        const response = await getGeocodeData<AddressResponse>(address);

        const addressInfoResult = response.results.map(result => ({
            coords: {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng
            },
            formattedAddress: result.formatted_address,
            place_id: result.place_id,
            country: getInfoFromAddressComponents(result.address_components, 'country') as Omit<AddressComponent, 'types'>,
            locality: getInfoFromAddressComponents(result.address_components, 'locality') as Omit<AddressComponent, 'types'>

        }))[0];

        return addressInfoResult;

    } catch (err) {
        console.error(err);
        throw err;
    }
}