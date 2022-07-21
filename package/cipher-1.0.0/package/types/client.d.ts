declare class CryptoClient {
    private PROTO_PATH;
    private SERVE_URI;
    private PACKAGE_NAME;
    client: any;
    constructor();
    private myProxy;
    /**
     * 关闭与密码服务的连接
     * @throws Exception
     */
    close(): void;
    sayHello(name: string): Promise<void>;
}
export default CryptoClient;
