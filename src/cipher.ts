/* *
 * 密码服务客户端
 * */
import ServeClient from './serve';
import { Reply } from './constant/common';
import * as Cipler from './constant/cipher';
import projectConfig from './config';

class CipherClient {
  private serve:ServeClient;

  constructor(option:Cipler.Option) {
    const { addr, rootCertPath, privateKeyPath, authority = 'quickservice', timeout = 5000 } = option;
    const { PROTO_PATH, PACKAGE_NAME, SERVE_NAME, PFX_CODE } = projectConfig;
    this.serve = new ServeClient({
      uri: addr,
      ssl: {
        isOpen: true,
        rootCertPath,
        privateKeyPath,
        authority
      },
      timeout,
      config: {
        PROTO_PATH,
        PACKAGE_NAME,
        SERVE_NAME,
        PFX_CODE
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

  /** 非对称加密 */
  async asymEncrypt({ plainText, certId }: Cipler.AsymEncryptRequest): Promise<Reply<Cipler.AsymEncryptResponse>> {
    return await this.myProxy('asymEncrypt', { 'plain_text': Buffer.from(plainText), 'cert_id': certId });
  }

  /** 非对称解密 */
  async asymDecrypt({ cipherText }: Cipler.AsymDecryptRequest): Promise<Reply<Cipler.AsymDecryptResponse>> {
    const res = await this.myProxy('asymDecrypt', { 'cipher_text': cipherText });
    if (res.err) return res;
    res.response.plainText = res.response.plainText.toString();
    return res;
  }

  /** 对称加密 */
  async symmDecrypt({ plainText, keyId = 'default', alg, iv, padding }: Cipler.SymmEncryptRequest): Promise<Reply<Cipler.SymmEncryptResponse>> {
    const req = {
      'key_id': keyId,
      'plain_text': plainText,
      'sym_alg': alg ? Buffer.from(alg) : null,
      iv,
      'sym_padding': padding
    };
    const res = await this.myProxy('symmDecrypt', req);
    if (res.err) return res;
    res.response.plainText = res.response.plainText.toString();
    return res;
  }
};


export default CipherClient;
