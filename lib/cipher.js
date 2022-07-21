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
class CipherClient {
    constructor(option) {
        const { addr, rootCertPath, privateKeyPath, authority, timeout = 5000 } = option;
        this.serve = new serve_1.default({
            uri: addr,
            ssl: {
                isOpen: true,
                rootCertPath,
                privateKeyPath,
                authority
            },
            timeout
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
    asyncSayHello(name) {
        return this.myProxy('sayHello', { name });
    }
    /**
     * 非对称加密
     * @param certId 证书标识，若为空则使用应用默认证书
     * @param plaintext 明文数据
     * @return 密文数据
     * @throws CryptoException
     */
    asymEncrypt(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.myProxy('asymEncrypt', { 'plain_text': request.plaintext });
        });
    }
}
;
exports.default = CipherClient;
