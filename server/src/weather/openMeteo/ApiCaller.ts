import { PossibleError, Error } from "@utils";

import { OpenMeteoRequest } from "./types.ts";

export class ApiCaller<T> {
    constructor(private req: OpenMeteoRequest) {}

    async call(): Promise<PossibleError<T>> {
        const headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        const searchParams: URLSearchParams = new URLSearchParams();
        
        searchParams.append("latitude", this.req.latitude.toString());
        searchParams.append("longitude", this.req.longitude.toString());

        if (this.req.elevation) searchParams.append("elevation", this.req.elevation.toString());
        if (this.req.forecast_days) searchParams.append("forecast_days", this.req.forecast_days.toString());

        if (this.req.hourly?.length) searchParams.append("hourly", this.req.hourly.join(","));
        if (this.req.daily?.length) searchParams.append("daily", this.req.daily.join(","));
        if (this.req.current?.length) searchParams.append("current", this.req.current.join(","));

        if (this.req.timezone) searchParams.append("timezone", this.req.timezone);
        if (this.req.start_hour) searchParams.append("start_hour", this.req.start_hour);
        if (this.req.end_hour) searchParams.append("end_hour", this.req.end_hour);
        if (this.req.start_date) searchParams.append("start_date", this.req.start_date);
        if (this.req.end_date) searchParams.append("end_date", this.req.end_date);

        const apiURL = `https://api.open-meteo.com/v1/forecast?${searchParams}`;

        const requestInfo: RequestInfo = new Request(apiURL, {
            method: "GET",
            headers: headers,
        });

        const response = await fetch(requestInfo);
        if (response.status != 200) {
            const error: Error = { code: response.status, message: response.statusText };
            return [undefined, error];
        }
        
        const data: T = await response.json()
        return [data, undefined];
    }
}