interface GoogleGeometry {
    location: { lat: number, lng: number };
}

interface GoogleGeocodingResult {
    geometry: GoogleGeometry;
    [key: string]: any;
}

export interface GoogleGeocodingResponse {
    results: GoogleGeocodingResult[];
    status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
}

export type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
  };


/**
 * Represents the response from the Google Geocoding API for an address.
 * This is a subset of the full response, defines the necessary info.
 */
export interface AddressResponse extends GoogleGeocodingResponse {
    results: {
        geometry: GoogleGeometry;
        formatted_address: string;
        place_id: string;
        address_components: AddressComponent[];
    }[];
}
