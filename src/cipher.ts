/* *
 * 密码服务客户端
 * */
import ServeClient from './serve';
import { Reply } from './constant/common';
import * as Cipler from './constant/cipher';
import projectConfig from './config';
import fs from 'fs';

class CipherClient {
  private serve:ServeClient;

  constructor(option:Cipler.Option) {
    const { addr, rootCertPath, clientStorePath, authority = 'quickservice', timeout = 5000 } = option;
    const { PROTO_PATH, PACKAGE_NAME, SERVE_NAME, PFX_CODE } = projectConfig;
    this.serve = new ServeClient({
      uri: addr,
      ssl: {
        isOpen: true,
        rootCertPath,
        clientStorePath,
        pfxCode: PFX_CODE,
        authority
      },
      timeout,
      config: {
        PROTO_PATH,
        PACKAGE_NAME,
        SERVE_NAME
      }
    });
  }

  public async init() {
    this.serve = await this.serve.initClient();
    return this;
  }

  public close() {
    return this.serve.close();
  }

  public throw(err:string = '异常') {
    throw new Error(err);
  }

  public myProxy(method:string, ...arg:any[]) {
    if (!this.serve) this.throw('The client is not initialized');
    return this.serve.myProxy(method, ...arg);
  }

  /**
   * 对称加密
   * @param plaintext 明文数据
   * @param keyId key ID
   * @param alg 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
   * @param iv IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
   * @param padding padding填充模式
   */
  async symmEncrypt({ plainText, keyId = 'default', alg, iv, padding }: Cipler.SymmEncryptRequest): Promise<Reply<Cipler.SymmEncryptResponse>> {
    const req = {
      'key_id': keyId,
      'plain_text': Buffer.from(plainText, 'base64'),
      'sym_alg': alg ? Buffer.from(alg) : null,
      iv,
      'sym_padding': padding
    };
    return await this.myProxy('symmEncrypt', req);
  }

  /**
   * 对称解密
   * @param cipherText 密文数据
   * @param keyId key ID
   * @param alg 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
   * @param iv IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
   * @param padding padding填充模式
   */
  async symmDecrypt({ cipherText, keyId = 'default', alg, iv, padding }: Cipler.SymmDecryptRequest): Promise<Reply<Cipler.SymmDecryptResponse>> {
    const req = {
      'key_id': keyId,
      'cipher_text': cipherText,
      'sym_alg': alg ? Buffer.from(alg) : null,
      iv,
      'sym_padding': padding
    };
    const res = await this.myProxy('symmDecrypt', req);
    if (res.err) return res;
    res.response.plainText = res.response.plainText.toString('base64');
    return res;
  }

  /**
   * 非对称加密
   * @param plainText 明文数据
   * @param certId 证书标识，若为空则使用应用默认证书
   */
  async asymEncrypt({ plainText, certId }: Cipler.AsymEncryptRequest): Promise<Reply<Cipler.AsymEncryptResponse>> {
    return await this.myProxy('asymEncrypt', { 'plain_text': Buffer.from(plainText, 'base64'), 'cert_id': certId });
  }

  /**
   * 非对称解密
   * @param cipherText 明文数据
   */
  async asymDecrypt({ cipherText }: Cipler.AsymDecryptRequest): Promise<Reply<Cipler.AsymDecryptResponse>> {
    const res = await this.myProxy('asymDecrypt', { 'cipher_text': cipherText });
    if (res.err) return res;
    res.response.plainText = res.response.plainText.toString('base64');
    return res;
  }

  /**
   * 签名
   * @param plainText 原文
   */
  async signData({ plainText }: Cipler.SignDataRequest):Promise<Reply<Cipler.SignDataResponse>> {
    return await this.myProxy('SignData', { 'plain_text': Buffer.from(plainText) });
  }

  /**
   * 验证数字签名,证书数据和证书ID同时存在,证书数据优先
   * @param certId 证书标识
   * @param plainText 原文
   * @param signText 签名值
   * @param certPath 证书数据地址,支持pem,der,base64
   * @param verifyLevel 证书验证级别
   */
  async verifySignedData({ certId, plainText, signText, certPath, verifyLevel }: Cipler.VerifySignedDataRequest):Promise<Reply<Cipler.VerifySignedDataResponse>> {
    const req = {
      'cert_id': certId,
      'plain_text': Buffer.from(plainText),
      'sign_text': signText,
      'cert_data': certPath ? fs.readFileSync(certPath) : null,
      'verify_level': verifyLevel
    };
    let { err, response } = await this.myProxy('verifySignedData', req);
    if (err?.message.startsWith('10 ABORTED: CryptoServiceHSM::VerifySignedData error')) {
      response = {
        verifyResult: false
      };
      err = null;
    }
    return {
      err,
      response
    };
  }

  /**
   * 计算MAC结果
   * @param keyId 共享密钥ID
   * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
   * @param plainText 明文数据
   */
  async calculateMAC({ keyId = 'default', macAlg, plainText }: Cipler.CalculateMACRequest):Promise<Reply<Cipler.CalculateMACResponse>> {
    const req = {
      'key_id': keyId,
      'mac_alg': macAlg,
      'plain_text': Buffer.from(plainText)
    };
    return await this.myProxy('CalculateMAC', req);
  }

  /**
   * 验证MAC
   * @param keyId 共享密钥ID
   * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
   * @param plainText 明文数据
   */
  async verifyMAC({ keyId = 'default', macAlg, plainText, macText }: Cipler.VerifyMACRequest):Promise<Reply<Cipler.VerifyMACResponse>> {
    // VerifyMAC 不好使
    // const req = {
    //   'key_id': keyId,
    //   'mac_alg': macAlg,
    //   'plain_text': Buffer.from(plainText),
    //   'mac_Text': macText
    // };
    // console.log(req);
    // return await this.myProxy('VerifyMAC', req);
    const { err, response } = await this.calculateMAC({ keyId, macAlg, plainText });
    if (err) {
      return {
        err,
        response: null
      };
    }
    const baseMacText = response?.macText;
    return {
      err: null,
      response: {
        verifyResult: macText.toString('base64') === baseMacText?.toString('base64')
      }
    };
    
  }

  /**
   * 以数字信封方式对明文数据进行加密。每个envelopeId对应唯一对称加密密钥，该加密密钥由加密服务生成，并使用接收者的公钥进行加密。
   * @param envelopeId 数字信封标识，由调用者指定，格式为数字和字母。每个envelopeId对应唯一对称加密密钥
   * @param receiverId 数字信封的接收者标识
   * @param plainText 明文数据
   */
  async evpEncryptData({ envelopeId, receiverId, plainText }: Cipler.EvpEncryptDataRequest):Promise<Reply<Cipler.EvpEncryptDataResponse>> {
    const req = {
      'enve_id': envelopeId,
      'receiver_id': receiverId,
      'plain_text': Buffer.from(plainText, 'base64')
    };
    const res = await this.myProxy('dataEncrypt', req);
    if (res.err) return res;
    res.response.cipherText = Buffer.from(res.response.cipherText, 'base64');
    return res;
  }

  /**
   * 对数字信封加密的密文进行解密，得到明文数据。
   * @param envelopeId 数字信封ID
   * @param cipherText 使用数字信封加密的数据
   */
  async evpDecryptData({ envelopeId, cipherText }: Cipler.EvpDecryptDataRequest):Promise<Reply<Cipler.EvpDecryptDataResponse>> {
    const req = {
      'enve_id': envelopeId,
      'cipher_text': cipherText.toString('base64')
    };
    let { err, response } = await this.myProxy('dataDecrypt', req);
    if (err?.message.startsWith('10 ABORTED: CryptoServiceHSM::VerifySignedData error')) {
      response = {
        verifyResult: false
      };
      err = null;
    }
    return {
      err,
      response
    };
  }

  /**
   * 创建时间戳
   * @param plainText 明文数据
   */
  async createTS({ plainText }: Cipler.CreateTSRequest):Promise<Reply<Cipler.CreateTSResponse>> {
    const req = {
      'plain_text': Buffer.from(plainText)
    };
    return await this.myProxy('CreateTS', req);
  }

  /**
   * 创建时间戳
   * @param tsText 时间戳
   */
  async verifyTS({ tsText }: Cipler.VerifyTSRequest):Promise<Reply<Cipler.VerifyTSResponse>> {
    const req = {
      'ts_text': tsText
    };
    return await this.myProxy('VerifyTS', req);
  }

  /**
   * 获取时间戳信息
   * @param tsText 时间戳
   * @param itemNum 信息项编号
   */
  async getTSDetailInfo({ tsText, itemNum }: Cipler.GetTSDetailInfoRequest):Promise<Reply<Cipler.GetTSDetailInfoResponse>> {
    const req = {
      'ts_text': tsText,
      'item_num': itemNum
    };
    return await this.myProxy('GetTSDetailInfo', req);
  }
};


export default CipherClient;
