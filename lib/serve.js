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
const fs_1 = __importDefault(require("fs"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const clientOptions_1 = __importDefault(require("./utils/clientOptions"));
const pfxUtils_1 = require("./utils/pfxUtils");
const utils_1 = require("./utils");
class ServeClient {
    constructor(option) {
        this.config = {
            PROTO_PATH: '',
            PACKAGE_NAME: '',
            SERVE_NAME: ''
        };
        this.address = '';
        this.timeout = 2000;
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
    initOption({ uri, ssl, timeout = 2000, config }) {
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
    }
    initClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, timeout, ssl, config } = this;
            const proto = this.getProto();
            const credentials = yield this.getCredentials();
            this.client = new proto[config.SERVE_NAME](address, credentials, (0, clientOptions_1.default)({ timeout, ssl }));
            return this;
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
        return __awaiter(this, void 0, void 0, function* () {
            const { isOpen, caPath, clientStorePath, pfxCode } = this.ssl;
            if (!isOpen)
                return grpc.credentials.createInsecure();
            const rootCerts = caPath ? fs_1.default.readFileSync(caPath) : null;
            const { privateKey, certificate } = yield (0, pfxUtils_1.parsePfx)(clientStorePath, pfxCode);
            return grpc.credentials.createSsl(rootCerts, Buffer.from(privateKey), Buffer.from(certificate));
        });
    }
    myProxy(method, ...arg) {
        return new Promise((resolve) => {
            try {
                if (!this.client)
                    throw Error('no client');
                this.client[method](...arg, (err, response) => {
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
    close() {
        if (!this.client)
            return;
        this.client.close();
    }
}
;
exports.default = ServeClient;
