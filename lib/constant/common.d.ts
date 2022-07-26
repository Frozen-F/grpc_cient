export interface Reply<T> {
    response: T | null;
    err: Error | null;
}
