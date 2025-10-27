export type DbItem<T> = {
    id: string;
    created_at: Date;
} & T;