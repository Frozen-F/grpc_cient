/// <reference types="node" />
import { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import { ChannelCredentials, Deadline } from '@grpc/grpc-js';
import { PassThrough } from 'stream';
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
    timeout?: number | undefined;
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
    waitForReady(deadline: Deadline): Promise<void>;
    getProto(): Record<string, any>;
    getCredentials(): ChannelCredentials;
    myProxy(method: string, data: Record<string, any> | PassThrough, ...args: any[]): Promise<Reply<any>>;
    close(): void;
}
