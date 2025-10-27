import { DbItem, DbService } from "@db";

import { Location, AddLocationRequest } from "./types.ts";
import { Error, PossibleError } from "@utils";

export class LocationsTable {
    constructor(private db: DbService) {}

    async list(): Promise<PossibleError<DbItem<Location>[]>> {
        return await this.db.list<Location>("SELECT * FROM locations");
    }

    async add({ location }: AddLocationRequest): Promise<Error | void> {
        return await this.db.create(`
            INSERT INTO locations
                (name, lat, lon, elevation, country, timezone)
            VALUES 
                (
                    '${location.name}',
                    ${location.lat},
                    ${location.lon},
                    ${location.elevation},
                    '${location.country}',
                    '${location.timezone}'
                )
        `);
    }
}