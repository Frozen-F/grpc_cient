import { Reply } from './constant/common';
import * as Cipler from './constant/cipher';
declare class CipherClient {
    private serve;
    constructor(option: Cipler.Option);
    init(): Promise<this>;
    close(): void;
    throw(err?: string): void;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    asyncSayHello(name: string): Promise<Reply<Cipler.HelloReply>>;
    /**
     * 非对称加密
     * @param certId 证书标识，若为空则使用应用默认证书
     * @param plaintext 明文数据
     * @return 密文数据
     * @throws CryptoException
     */
    asymEncrypt(request: Cipler.AsymEncryptRequest): Promise<Reply<Cipler.AsymEncryptResponse>>;
}
export default CipherClient;
