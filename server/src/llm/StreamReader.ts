// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream
import { LlmStreamChunk } from "./types.ts";

export class StreamReader<T> implements UnderlyingDefaultSource<string> {

    constructor(
        private reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>, 
        private decoder: TextDecoder,
        private mapper: (data: T) => LlmStreamChunk
    ) { }

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
            const json: T = JSON.parse(line);
            const normalized: LlmStreamChunk = this.mapper(json);
            controller.enqueue(JSON.stringify(normalized) + "\n");
        }
    }
}