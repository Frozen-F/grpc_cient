"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
 * 密码客户端实例
 * */
const path = require('path');
const fs_1 = __importDefault(require("fs"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const clientOptions_1 = __importDefault(require("./utils/clientOptions"));
const pfxUtils_1 = require("./utils/pfxUtils");
const config_1 = __importDefault(require("./config"));
/**
  * @param uri 加密服务的地址列表，格式为“IP:端口”，例如：new String[]{"192.168.1.1:8443", "192.168.1.2:8443"}
  * @param rootCertPath SDK客户端证书的CA根证书
  * @param KeyStorePath SDK客户端的证书与私钥文件
  * @param authority 密码服务名称（与服务证书的Common Name保持一致），默认为quickservice
  */
class ServeClient {
    constructor(option) {
        /** 加密服务的地址，格式为“IP:端口”，例如：192.168.1.1:8443 */
        this.address = '';
        this.timeout = 2000;
        /** ssl配置信息 */
        this.ssl = {
            isOpen: false,
            caPath: '',
            clientStorePath: '',
            authority: 'quickservice'
        };
        /** 客户端实例 */
        this.client = null;
        this.initOption(option);
    }
    // 设置配置信息等
    initOption({ uri, ssl, timeout = 2000 }) {
        this.address = uri;
        this.timeout = timeout;
        const { rootCertPath, privateKeyPath, authority, isOpen = false } = ssl || {};
        Object.assign(this.ssl, {
            isOpen,
            caPath: rootCertPath ? path.join(__dirname, rootCertPath) : '',
            clientStorePath: privateKeyPath ? path.join(__dirname, privateKeyPath) : '',
            authority: authority
        });
    }
    // 初始化客户端
    initClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, timeout } = this;
            const proto = this.getProto();
            const credentials = yield this.getCredentials();
            this.client = new proto[config_1.default.SERVE_NAME](address, credentials, (0, clientOptions_1.default)({ timeout }));
            return this;
        });
    }
    // 获取proto对象
    getProto() {
        const { PROTO_PATH, PACKAGE_NAME } = config_1.default;
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        let proto = grpc.loadPackageDefinition(packageDefinition);
        for (const key of PACKAGE_NAME.split('.')) {
            if (!proto[key])
                break;
            proto = proto[key];
        }
        return proto;
    }
    // 获取授权信息
    getCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isOpen, caPath, clientStorePath } = this.ssl;
            if (!isOpen)
                return grpc.credentials.createInsecure();
            const rootCerts = caPath ? fs_1.default.readFileSync(caPath) : null;
            const { key: privateKey, certificate } = yield (0, pfxUtils_1.parsePfx)(clientStorePath, config_1.default.PFX_CODE);
            return grpc.credentials.createSsl(rootCerts, Buffer.from(privateKey), Buffer.from(certificate));
        });
    }
    // 代理
    myProxy(method, ...arg) {
        return new Promise((resolve) => {
            try {
                if (!this.client)
                    throw Error('no client');
                this.client[method](...arg, (err, response) => {
                    resolve({
                        err,
                        response
                    });
                });
            }
            catch (err) {
                resolve({
                    response: null,
                    err
                });
            }
        });
    }
    /**
     * 关闭与密码服务的连接
     */
    close() {
        if (!this.client)
            return;
        this.client.close();
    }
}
;
exports.default = ServeClient;
