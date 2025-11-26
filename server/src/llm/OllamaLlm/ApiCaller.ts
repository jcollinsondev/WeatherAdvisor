import { PossibleError, Error } from "@utils";
import { StreamReader } from "@llm";

import { OllamaRequest, OllamaResponse } from "./types.ts";

export class ApiCaller {
    constructor(private req: OllamaRequest) {}
    
    async call(): Promise<PossibleError<ReadableStream<string>>> {
        const headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/x-ndjson");

        const apiURL = "http://ollama:11434/api/generate";

        const requestInfo: RequestInfo = new Request(apiURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(this.req),
        });

        const response = await fetch(requestInfo);
        if (response.status != 200) {
            const error: Error = { code: response.status, message: response.statusText };
            return [undefined, error];
        }
        if (!response.body) {
            const error: Error = { code: 500, message: "Missing body in response." };
            return [undefined, error];
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const mapper = (r: OllamaResponse) => ({ createdAt: r.created_at, response: r.response, done: r.done });

        const stream = new ReadableStream<string>(new StreamReader<OllamaResponse>(reader, decoder, mapper));

        return [stream, undefined];
    }
}