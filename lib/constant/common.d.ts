export interface Reply<T> {
    response: T;
    err?: Error;
}
export interface ClientOption {
    uri: string | string[];
    ssl?: {
        rootCertPath?: string;
        privateKeyPath?: string;
        authority?: string;
        isOpen: boolean;
    };
    timeout?: number;
}
