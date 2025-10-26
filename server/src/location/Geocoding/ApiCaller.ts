import { PossibleError, Error } from "@utils";

import { GeocodingRequest, GeocodingResponse } from "./types.ts";

export class ApiCaller {
    constructor(private req: GeocodingRequest) {}

    async call(): Promise<PossibleError<GeocodingResponse>> {
        const headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        const searchParams: URLSearchParams = new URLSearchParams();
        
        searchParams.append("name", this.req.name.toString());

        const apiURL = `https://geocoding-api.open-meteo.com/v1/search?${searchParams}`;

        const requestInfo: RequestInfo = new Request(apiURL, {
            method: "GET",
            headers: headers,
        });

        const response = await fetch(requestInfo);
        if (response.status != 200) {
            const error: Error = { code: response.status, message: response.statusText };
            return [undefined, error];
        }

        const json = await response.json();
        if (!json.results) {
            return [{ results: [] }, undefined];
        }
        
        const data: GeocodingResponse = json;
        return [data, undefined];
    }
}