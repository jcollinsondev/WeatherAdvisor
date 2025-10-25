import { PossibleError } from "@utils";

import { LocationResponse } from "./types.ts";

export interface ILocationService {
    search(name: string): Promise<PossibleError<LocationResponse>>
}