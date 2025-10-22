import { PossibleError } from "@utils";

export interface ILlmService {
    ask(prompt: string): Promise<PossibleError<string>>
}