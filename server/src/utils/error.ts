export interface Error {
    code: number;
    message: string;
}

export type PossibleError<T> = [T, undefined] | [undefined, Error];

export const ImATeaPotError: Error = { code: 418, message: "The server refuses the attempt to brew coffee with a teapot." };