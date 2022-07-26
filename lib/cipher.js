"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 * 密码服务客户端
 * */
const serve_1 = __importDefault(require("./serve"));
const config_1 = __importDefault(require("./config"));
const fs_1 = __importDefault(require("fs"));
class CipherClient {
    constructor(option) {
        const { addr, rootCertPath, clientStorePath, authority = 'quickservice', timeout = 5000 } = option;
        const { PROTO_PATH, PACKAGE_NAME, SERVE_NAME, PFX_CODE } = config_1.default;
        this.serve = new serve_1.default({
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.serve = yield this.serve.initClient();
            return this;
        });
    }
    close() {
        return this.serve.close();
    }
    throw(err = '异常') {
        throw new Error(err);
    }
    myProxy(method, ...arg) {
        if (!this.serve)
            this.throw('The client is not initialized');
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
    symmEncrypt({ plainText, keyId = 'default', alg, iv, padding }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'key_id': keyId,
                'plain_text': Buffer.from(plainText, 'base64'),
                'sym_alg': alg ? Buffer.from(alg) : null,
                iv,
                'sym_padding': padding
            };
            return yield this.myProxy('symmEncrypt', req);
        });
    }
    /**
     * 对称解密
     * @param cipherText 密文数据
     * @param keyId key ID
     * @param alg 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
     * @param iv IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
     * @param padding padding填充模式
     */
    symmDecrypt({ cipherText, keyId = 'default', alg, iv, padding }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'key_id': keyId,
                'cipher_text': cipherText,
                'sym_alg': alg ? Buffer.from(alg) : null,
                iv,
                'sym_padding': padding
            };
            const res = yield this.myProxy('symmDecrypt', req);
            if (res.err)
                return res;
            res.response.plainText = res.response.plainText.toString('base64');
            return res;
        });
    }
    /**
     * 非对称加密
     * @param plainText 明文数据
     * @param certId 证书标识，若为空则使用应用默认证书
     */
    asymEncrypt({ plainText, certId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.myProxy('asymEncrypt', { 'plain_text': Buffer.from(plainText, 'base64'), 'cert_id': certId });
        });
    }
    /**
     * 非对称解密
     * @param cipherText 明文数据
     */
    asymDecrypt({ cipherText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.myProxy('asymDecrypt', { 'cipher_text': cipherText });
            if (res.err)
                return res;
            res.response.plainText = res.response.plainText.toString('base64');
            return res;
        });
    }
    /**
     * 签名
     * @param plainText 原文
     */
    signData({ plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.myProxy('SignData', { 'plain_text': Buffer.from(plainText, 'base64') });
        });
    }
    /**
     * 验证数字签名,证书数据和证书ID同时存在,证书数据优先
     * @param certId 证书标识
     * @param plainText 原文
     * @param signText 签名值
     * @param certPath 证书数据地址,支持pem,der,base64
     * @param verifyLevel 证书验证级别
     */
    verifySignedData({ certId, plainText, signText, certPath, verifyLevel }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'cert_id': certId,
                'plain_text': Buffer.from(plainText, 'base64'),
                'sign_text': signText,
                'cert_data': fs_1.default.readFileSync(certPath),
                'verify_level': verifyLevel
            };
            return yield this.myProxy('verifySignedData', req);
        });
    }
    /**
     * 计算MAC结果
     * @param keyId 共享密钥ID
     * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
     * @param plainText 明文数据
     */
    calculateMAC({ keyId, macAlg, plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'cert_id': keyId,
                'mac_alg': macAlg,
                'plain_text': Buffer.from(plainText, 'base64')
            };
            return yield this.myProxy('calculateMAC', req);
        });
    }
    /**
     * 验证MAC
     * @param keyId 共享密钥ID
     * @param macAlg mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
     * @param plainText 明文数据
     */
    verifyMAC({ keyId, macAlg, plainText, macText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'cert_id': keyId,
                'mac_alg': macAlg,
                'plain_text': Buffer.from(plainText, 'base64'),
                'mac_Text': macText
            };
            return yield this.myProxy('verifyMAC', req);
        });
    }
    /**
     * 以数字信封方式对明文数据进行加密。每个envelopeId对应唯一对称加密密钥，该加密密钥由加密服务生成，并使用接收者的公钥进行加密。
     * @param envelopeId 数字信封标识，由调用者指定，格式为数字和字母。每个envelopeId对应唯一对称加密密钥
     * @param receiverId 数字信封的接收者标识
     * @param plainText 明文数据
     */
    evpEncryptData({ envelopeId, receiverId, plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'enve_id': envelopeId,
                'receiver_id': receiverId,
                'plain_text': Buffer.from(plainText, 'base64')
            };
            const res = yield this.myProxy('dataEncrypt', req);
            if (res.err)
                return res;
            res.response.cipherText = Buffer.from(res.response.cipherText, 'base64');
            return res;
        });
    }
    /**
     * 对数字信封加密的密文进行解密，得到明文数据。
     * @param envelopeId 数字信封ID
     * @param cipherText 使用数字信封加密的数据
     */
    evpDecryptData({ envelopeId, cipherText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'enve_id': envelopeId,
                'cipher_text': cipherText.toString('base64')
            };
            const res = yield this.myProxy('dataDecrypt', req);
            if (res.err)
                return res;
            res.response.plainText = Buffer.from(res.response.plainText, 'base64');
            return res;
        });
    }
    /**
     * 创建时间戳
     * @param plainText 明文数据
     */
    createTS({ plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'plain_text': Buffer.from(plainText, 'base64')
            };
            return yield this.myProxy('CreateTS', req);
        });
    }
    /**
     * 创建时间戳
     * @param tsText 时间戳
     */
    verifyTS({ tsText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'ts_text': tsText
            };
            return yield this.myProxy('VerifyTS', req);
        });
    }
    /**
     * 获取时间戳信息
     * @param tsText 时间戳
     * @param itemNum 信息项编号
     */
    getTSDetailInfo({ tsText, itemNum }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'ts_text': tsText,
                'item_num': itemNum
            };
            return yield this.myProxy('GetTSDetailInfo', req);
        });
    }
}
;
exports.default = CipherClient;
