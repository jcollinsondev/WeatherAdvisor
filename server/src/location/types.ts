export interface Location {
    name: string;
    lat: number;
    lon: number;
    elevation: number;
    country: string;
    timezone: string;
}

export interface LocationResponse {
    results: Location[];
}