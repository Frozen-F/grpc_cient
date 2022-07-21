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
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 * 密码客户端实例
 * */
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
var Status;
(function (Status) {
    Status[Status["success"] = 1] = "success";
    Status[Status["error"] = 0] = "error";
    Status[Status["serveErr"] = 2] = "serveErr";
})(Status || (Status = {}));
class CryptoClient {
    constructor() {
        this.PROTO_PATH = path.join(__dirname, '../protos/Hello.proto');
        this.SERVE_URI = 'localhost:50051';
        this.PACKAGE_NAME = 'hello';
        const { PROTO_PATH, PACKAGE_NAME } = this;
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        const HelloProto = grpc.loadPackageDefinition(packageDefinition)[PACKAGE_NAME];
        this.client = new HelloProto.MainGreeter(this.SERVE_URI, grpc.credentials.createInsecure());
        return this;
    }
    myProxy(fun, ...arg) {
        return new Promise((resolve) => {
            try {
                this.client[fun](...arg, (err, response) => {
                    if (err) {
                        resolve({
                            status: Status.error,
                            err
                        });
                    }
                    ;
                    resolve({
                        status: Status.success,
                        response
                    });
                });
            }
            catch (err) {
                resolve({
                    status: Status.serveErr,
                    err
                });
            }
        });
    }
    /**
     * 关闭与密码服务的连接
     * @throws Exception
     */
    close() {
        if (!this.client)
            return;
        this.client.close();
    }
    sayHello(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, response, err } = yield this.myProxy('sayHello', { name });
            console.log(status, response, err);
            return;
        });
    }
}
;
exports.default = CryptoClient;
