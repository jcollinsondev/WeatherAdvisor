import { PossibleError } from "@utils";

import { ILlmService } from "./LlmService.ts";

export const mock: ILlmService = {
  ask: function (_prompt: string): Promise<PossibleError<string>> {
    return new Promise((resolve) => {
        resolve(["This is my answer", undefined]);
    });
  }
}