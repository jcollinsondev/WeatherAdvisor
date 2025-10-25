import { PossibleError } from "@utils";

import { LocationResponse, Location } from "./types.ts";
import { ILocationService } from "./LocationService.ts";

export const mock: ILocationService = {
    search(_: string): Promise<PossibleError<LocationResponse>> {
        return new Promise((resolve) => {
            const town: Location = {
                name: "town",
                lat: 0,
                lon: 0,
            };
            resolve([{ results: [town] }, undefined]);
        });
    }
}