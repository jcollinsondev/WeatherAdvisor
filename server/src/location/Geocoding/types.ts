// DOCS: https://open-meteo.com/en/docs/geocoding-api
export interface GeocodingRequest {
    name: string;
}

export interface GeocodingResponse {
    results: GeocodingLocation[];
}

export interface GeocodingLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    country_code: string;
    timezone: string;
    country_id: number;
    country: string;
}