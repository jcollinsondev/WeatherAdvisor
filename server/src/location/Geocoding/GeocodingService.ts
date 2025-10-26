import { PossibleError } from "@utils";
import { ILocationService, Location, LocationResponse } from "@location";

import { ApiCaller } from "./ApiCaller.ts";

export class GeocodingService implements ILocationService {
    async search(name: string): Promise<PossibleError<LocationResponse>> {
        const api = new ApiCaller({ name });

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        const results: Location[] = response.results.map(location => ({
            name: location.name,
            lat: location.latitude,
            lon: location.longitude,
            elevation: location.elevation,
            country: location.country,
            timezone: location.timezone,
        }));

        return [{ results }, undefined];
    }
}