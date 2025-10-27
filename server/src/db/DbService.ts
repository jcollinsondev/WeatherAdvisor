import { Client } from "postgres";
import { PossibleError, Error } from "@utils";

import { DbItem } from "./types.ts";

export class DbService {
    private client: Client;

    constructor() {
        this.client = new Client({
            user: "root",
            password: "secret_password",
            database: "weatheradvisor",
            hostname: "db",
            port: 5432,
        });
    }

    async get<T>(query: string): Promise<PossibleError<DbItem<T>>> {
        await this.client.connect();
        if (!this.client.connected) return [undefined, { code: 500, message: "The db is not connected." }];

        const result = await this.client.queryObject<DbItem<T>>(query);
        await this.client.end();

        if (!result.rowCount) return [undefined, { code: 404, message: "Item not found." }];

        const [safeItem] = result.rows.map(row => ({
            ...row,
            id: row.id.toString(),
        }));

        return [safeItem, undefined];
    }

    async list<T>(query: string): Promise<PossibleError<DbItem<T>[]>> {
        await this.client.connect();
        if (!this.client.connected) return [undefined, { code: 500, message: "The db is not connected." }];

        const result = await this.client.queryObject<DbItem<T>>(query);
        await this.client.end();

        const safeRows = result.rows.map(row => ({
            ...row,
            id: row.id.toString(),
        })); 

        return [safeRows, undefined];
    }

    async create(query: string): Promise<Error | void> {
        await this.client.connect();
        if (!this.client.connected) return { code: 500, message: "The db is not connected." };

        await this.client.queryObject(query);
        await this.client.end();
    }

    async delete(query: string): Promise<Error | void> {
        await this.client.connect();
        if (!this.client.connected) return { code: 500, message: "The db is not connected." };

        await this.client.queryObject(query);
        await this.client.end();
    }
}