import { Timeframe } from "@weather";
import { Location } from "@location";

export interface LlmStreamChunk {
    createdAt: Date;
    response?: string;
    done: boolean;
}

export interface AskQuestionRequest {
    question: string;
    timeframe: Timeframe;
    dataType: "daily" | "hourly";
    location: Location;
}