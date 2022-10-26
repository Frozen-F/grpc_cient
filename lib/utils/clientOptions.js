"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = require("@grpc/grpc-js");
exports.default = ({ timeout, ssl }) => {
    return {
        'grpc.ssl_target_name_override': ssl.authority,
        interceptors: [
            (options, nextCall) => {
                if (timeout) {
                    options.deadline = new Date().getTime() + timeout;
                }
                const requester = {};
                return new grpc_js_1.InterceptingCall(nextCall(options), requester);
            }
        ]
    };
};
