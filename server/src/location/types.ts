export interface Location {
    name: string;
    lat: number;
    lon: number;
}

export interface LocationResponse {
    results: Location[];
}