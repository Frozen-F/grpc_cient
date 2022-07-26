import { Reply } from './constant/common';
import * as Cipler from './constant/cipher';
declare class CipherClient {
    private serve;
    constructor(option: Cipler.Option);
    init(): Promise<this>;
    close(): void;
    throw(err?: string): void;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    /**
     * 对称加密
     * @param plaintext 明文数据
     * @param keyId key ID
     * @param alg 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
     * @param iv IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
     * @param padding padding填充模式
     */
    symmEncrypt({ plainText, keyId, alg, iv, padding }: Cipler.SymmEncryptRequest): Promise<Reply<Cipler.SymmEncryptResponse>>;
    /**
     * 对称解密
     * @param cipherText 密文数据
     * @param keyId key ID
     * @param alg 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
     * @param iv IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
     * @param padding padding填充模式
     */
    symmDecrypt({ cipherText, keyId, alg, iv, padding }: Cipler.SymmDecryptRequest): Promise<Reply<Cipler.SymmDecryptResponse>>;
    /**
     * 非对称加密
     * @param plainText 明文数据
     * @param certId 证书标识，若为空则使用应用默认证书
     */
    asymEncrypt({ plainText, certId }: Cipler.AsymEncryptRequest): Promise<Reply<Cipler.AsymEncryptResponse>>;
    /**
     * 非对称解密
     * @param cipherText 明文数据
     */
    asymDecrypt({ cipherText }: Cipler.AsymDecryptRequest): Promise<Reply<Cipler.AsymDecryptResponse>>;
    /**
     * 签名
     * @param plainText 原文
     */
    signData({ plainText }: Cipler.SignDataRequest): Promise<Reply<Cipler.SignDataResponse>>;
    /**
     * 验证数字签名,证书数据和证书ID同时存在,证书数据优先
     * @param certId 证书标识
     * @param plainText 原文
     * @param signText 签名值
     * @param certPath 证书数据地址,支持pem,der,base64
     * @param verifyLevel 证书验证级别
     */
    verifySignedData({ certId, plainText, signText, certPath, verifyLevel }: Cipler.VerifySignedDataRequest): Promise<Reply<Cipler.VerifySignedDataResponse>>;
    /**
     * 计算MAC结果
     * @param keyId 共享密钥ID
     * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
     * @param plainText 明文数据
     */
    calculateMAC({ keyId, macAlg, plainText }: Cipler.CalculateMACRequest): Promise<Reply<Cipler.CalculateMACResponse>>;
    /**
     * 验证MAC
     * @param keyId 共享密钥ID
     * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
     * @param plainText 明文数据
     */
    verifyMAC({ keyId, macAlg, plainText, macText }: Cipler.VerifyMACRequest): Promise<Reply<Cipler.VerifyMACResponse>>;
    /**
     * 以数字信封方式对明文数据进行加密。每个envelopeId对应唯一对称加密密钥，该加密密钥由加密服务生成，并使用接收者的公钥进行加密。
     * @param envelopeId 数字信封标识，由调用者指定，格式为数字和字母。每个envelopeId对应唯一对称加密密钥
     * @param receiverId 数字信封的接收者标识
     * @param plainText 明文数据
     */
    evpEncryptData({ envelopeId, receiverId, plainText }: Cipler.EvpEncryptDataRequest): Promise<Reply<Cipler.EvpEncryptDataResponse>>;
    /**
     * 对数字信封加密的密文进行解密，得到明文数据。
     * @param envelopeId 数字信封ID
     * @param cipherText 使用数字信封加密的数据
     */
    evpDecryptData({ envelopeId, cipherText }: Cipler.EvpDecryptDataRequest): Promise<Reply<Cipler.EvpDecryptDataResponse>>;
    /**
     * 创建时间戳
     * @param plainText 明文数据
     */
    createTS({ plainText }: Cipler.CreateTSRequest): Promise<Reply<Cipler.CreateTSResponse>>;
    /**
     * 创建时间戳
     * @param tsText 时间戳
     */
    verifyTS({ tsText }: Cipler.VerifyTSRequest): Promise<Reply<Cipler.VerifyTSResponse>>;
    /**
     * 获取时间戳信息
     * @param tsText 时间戳
     * @param itemNum 信息项编号
     */
    getTSDetailInfo({ tsText, itemNum }: Cipler.GetTSDetailInfoRequest): Promise<Reply<Cipler.GetTSDetailInfoResponse>>;
}
export default CipherClient;
