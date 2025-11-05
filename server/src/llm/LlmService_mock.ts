import { PossibleError } from "@utils";

import { ILlmService } from "./LlmService.ts";

export const mock: ILlmService = {
    ask: function (_prompt: string): Promise<PossibleError<ReadableStream<string>>> {
        return new Promise((resolve) => {
            resolve([new ReadableStream<string>(), undefined]);
        });
    }
}