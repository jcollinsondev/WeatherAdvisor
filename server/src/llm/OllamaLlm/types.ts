export interface OllamaRequest {
    model: string;
    prompt: string;
}

export interface OllamaResponse {
    model: string;
    created_at: Date;
    response?: string;
    done: boolean;
    done_reason?: string;
}