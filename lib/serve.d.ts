import { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import { ChannelCredentials } from '@grpc/grpc-js';
import { Reply, ClientOption } from './constant/common';
/**
  * @param uri 加密服务的地址列表，格式为“IP:端口”，例如：new String[]{"192.168.1.1:8443", "192.168.1.2:8443"}
  * @param rootCertPath SDK客户端证书的CA根证书
  * @param KeyStorePath SDK客户端的证书与私钥文件
  * @param authority 密码服务名称（与服务证书的Common Name保持一致），默认为quickservice
  */
declare class ServeClient {
    /** 加密服务的地址，格式为“IP:端口”，例如：192.168.1.1:8443 */
    private address;
    private timeout;
    /** ssl配置信息 */
    private ssl;
    /** 客户端实例 */
    client: ServiceClient | null;
    constructor(option: ClientOption);
    private initOption;
    initClient(): Promise<this>;
    getProto(): Record<string, any>;
    getCredentials(): Promise<ChannelCredentials>;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    /**
     * 关闭与密码服务的连接
     */
    close(): void;
}
export default ServeClient;
