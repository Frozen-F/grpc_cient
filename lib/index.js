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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fs_1 = __importDefault(require("fs"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const lodash = __importStar(require("lodash"));
const clientOptions_1 = __importDefault(require("./utils/clientOptions"));
const pfxUtils_1 = require("./utils/pfxUtils");
const utils_1 = require("./utils");
class Client {
    constructor(option) {
        this.config = {
            PROTO_PATH: '',
            PACKAGE_NAME: '',
            SERVE_NAME: ''
        };
        this.address = '';
        this.timeout = undefined;
        this.ssl = {
            isOpen: false,
            caPath: '',
            clientStorePath: '',
            pfxCode: '',
            authority: ''
        };
        this.client = null;
        this.initOption(option);
    }
    initOption({ uri, ssl, timeout, config }) {
        this.address = uri;
        this.timeout = timeout;
        const { rootCertPath, clientStorePath, pfxCode, authority, isOpen = false } = ssl || {};
        Object.assign(this.ssl, {
            isOpen,
            caPath: rootCertPath,
            clientStorePath,
            pfxCode,
            authority
        });
        Object.assign(this.config, config);
        this.init();
    }
    init() {
        const { address, timeout, ssl, config } = this;
        const proto = this.getProto();
        const credentials = this.getCredentials();
        this.client = new proto[config.SERVE_NAME](address, credentials, (0, clientOptions_1.default)({ timeout, ssl }));
        return this;
    }
    waitForReady(deadline) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.waitForReady(deadline, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    getProto() {
        const { PROTO_PATH, PACKAGE_NAME } = this.config;
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
    getCredentials() {
        const { isOpen, caPath, clientStorePath, pfxCode } = this.ssl;
        if (!isOpen)
            return grpc.credentials.createInsecure();
        const rootCerts = caPath ? fs_1.default.readFileSync(caPath) : null;
        const { privateKey, certificate } = (0, pfxUtils_1.parsePfx)(clientStorePath, pfxCode);
        return grpc.credentials.createSsl(rootCerts, Buffer.from(privateKey), Buffer.from(certificate));
    }
    myProxy(method, data, ...args) {
        const callback = (resolve) => {
            return (err, response) => {
                if (response) {
                    for (const key of Object.keys(response)) {
                        const camelCaseKey = (0, utils_1.camelCase)(key);
                        if (key === camelCaseKey)
                            continue;
                        response[camelCaseKey] = response[key];
                        delete response[key];
                    }
                }
                resolve({
                    err,
                    response
                });
            };
        };
        return new Promise((resolve) => {
            try {
                if (!this.client)
                    throw Error('no client');
                const isStream = lodash.isFunction(data.read) && lodash.isFunction(data.on);
                if (isStream) {
                    const call = this.client[method](...args, callback(resolve));
                    data.pipe(call);
                    return;
                }
                this.client[method](data, ...args, callback(resolve));
            }
            catch (err) {
                resolve({
                    response: null,
                    err
                });
            }
        });
    }
    close() {
        if (!this.client)
            return;
        this.client.close();
    }
}
exports.Client = Client;
;
