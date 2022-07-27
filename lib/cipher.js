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
            this.serve = yield this.serve.init();
            return this;
        });
    }
    close() {
        return this.serve.close();
    }
    myProxy(method, ...arg) {
        if (!this.serve)
            throw new Error('The client is not initialized');
        return this.serve.myProxy(method, ...arg);
    }
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
    asymEncrypt({ plainText, certId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.myProxy('asymEncrypt', { 'plain_text': Buffer.from(plainText, 'base64'), 'cert_id': certId });
        });
    }
    asymDecrypt({ cipherText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.myProxy('asymDecrypt', { 'cipher_text': cipherText });
            if (res.err)
                return res;
            res.response.plainText = res.response.plainText.toString('base64');
            return res;
        });
    }
    signData({ plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.myProxy('SignData', { 'plain_text': Buffer.from(plainText) });
        });
    }
    verifySignedData({ certId, plainText, signText, certPath, verifyLevel }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'cert_id': certId,
                'plain_text': Buffer.from(plainText),
                'sign_text': signText,
                'cert_data': certPath ? fs_1.default.readFileSync(certPath) : null,
                'verify_level': verifyLevel
            };
            let { err, response } = yield this.myProxy('verifySignedData', req);
            if (err === null || err === void 0 ? void 0 : err.message.startsWith('10 ABORTED: CryptoServiceHSM::VerifySignedData error')) {
                response = {
                    verifyResult: false
                };
                err = null;
            }
            return {
                err,
                response
            };
        });
    }
    calculateMAC({ keyId = 'default', macAlg, plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'key_id': keyId,
                'mac_alg': macAlg,
                'plain_text': Buffer.from(plainText)
            };
            return yield this.myProxy('CalculateMAC', req);
        });
    }
    verifyMAC({ keyId = 'default', macAlg, plainText, macText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { err, response } = yield this.calculateMAC({ keyId, macAlg, plainText });
            if (err) {
                return {
                    err,
                    response: null
                };
            }
            const baseMacText = response === null || response === void 0 ? void 0 : response.macText;
            return {
                err: null,
                response: {
                    verifyResult: macText.toString('base64') === (baseMacText === null || baseMacText === void 0 ? void 0 : baseMacText.toString('base64'))
                }
            };
        });
    }
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
    evpDecryptData({ envelopeId, cipherText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'enve_id': envelopeId,
                'cipher_text': cipherText.toString('base64')
            };
            let { err, response } = yield this.myProxy('dataDecrypt', req);
            if (err === null || err === void 0 ? void 0 : err.message.startsWith('10 ABORTED: CryptoServiceHSM::VerifySignedData error')) {
                response = {
                    verifyResult: false
                };
                err = null;
            }
            return {
                err,
                response
            };
        });
    }
    createTS({ plainText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'plain_text': Buffer.from(plainText)
            };
            return yield this.myProxy('CreateTS', req);
        });
    }
    verifyTS({ tsText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                'ts_text': tsText
            };
            return yield this.myProxy('VerifyTS', req);
        });
    }
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
