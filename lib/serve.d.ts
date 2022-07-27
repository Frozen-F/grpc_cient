import { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import { ChannelCredentials } from '@grpc/grpc-js';
import { ClientOption } from './constant/serve';
import { Reply } from './constant/common';
declare class ServeClient {
    private config;
    private address;
    private timeout;
    private ssl;
    client: ServiceClient | null;
    constructor(option: ClientOption);
    private initOption;
    initClient(): Promise<this>;
    getProto(): Record<string, any>;
    getCredentials(): Promise<ChannelCredentials>;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    close(): void;
}
export default ServeClient;
