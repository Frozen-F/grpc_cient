import { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import { ChannelCredentials } from '@grpc/grpc-js';
export interface Reply<T> {
    response: T | null;
    err: Error | null;
}
export interface Config {
    PROTO_PATH: string;
    PACKAGE_NAME: string;
    SERVE_NAME: string;
}
export interface ClientOption {
    uri: string | string[];
    config: Config;
    ssl?: {
        rootCertPath?: string;
        clientStorePath?: string;
        authority?: string;
        pfxCode?: string;
        isOpen: boolean;
    };
    timeout?: number;
}
export declare class Client {
    private config;
    private address;
    private timeout;
    private ssl;
    client: ServiceClient | null;
    constructor(option: ClientOption);
    private initOption;
    init(): this;
    getProto(): Record<string, any>;
    getCredentials(): ChannelCredentials;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    close(): void;
}
