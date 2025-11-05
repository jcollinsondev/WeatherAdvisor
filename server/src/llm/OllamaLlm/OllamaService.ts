import { PossibleError } from "@utils";
import { ILlmService } from "@llm";

import { OllamaRequest } from "./types.ts";
import { ApiCaller } from "./ApiCaller.ts";

export class OllamaService implements ILlmService {
    constructor(private model: string) { }

    async ask(prompt: string): Promise<PossibleError<ReadableStream<string>>> {
        const req: OllamaRequest = { model: this.model, prompt: prompt };
        const api = new ApiCaller(req);

        return await api.call();
    }
}