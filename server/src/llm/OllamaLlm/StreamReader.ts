// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
import { LlmStreamChunk } from "@llm";

import { OllamaResponse } from "./types.ts";

export class StreamReader implements UnderlyingDefaultSource<string> {

    constructor(private reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>, private decoder: TextDecoder) { }

    async start(controller: ReadableStreamDefaultController<string>) {
        await this.read(controller);
    }

    async pull(controller: ReadableStreamDefaultController<string>) {
        await this.read(controller);
    }

    async cancel() {
        await this.reader.cancel();
    }

    private async read(controller: ReadableStreamDefaultController<string>) {
        const { done, value } = await this.reader.read();
        if (done) {
            controller.close();
            return;
        }

        const chunk = this.decoder.decode(value, { stream: true });

        for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            const json: OllamaResponse = JSON.parse(line);
            const normalized: LlmStreamChunk = { createdAt: json.created_at, response: json.response, done: json.done };
            controller.enqueue(JSON.stringify(normalized) + "\n");
        }
    }
}