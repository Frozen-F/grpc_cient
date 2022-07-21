"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = require("@grpc/grpc-js");
/**
 *  @describe grpc客户端配置的options
  * @param timeout 超时
  */
exports.default = ({ timeout = 2000 }) => {
    return {
        'grpc.ssl_target_name_override': 'quickservice',
        // 拦截器
        interceptors: [
            (options, nextCall) => {
                options.deadline = new Date().getTime() + timeout;
                const requester = {
                // // 在启动出站调用之前调用的拦截方法。
                // start() {},
                // // 在每个出站消息之前调用的拦截方法。
                // sendMessage() {},
                // // 当出站流关闭时（在消息发送后）调用的拦截方法。
                // halfClose() {},
                // // 从客户端取消请求时调用的拦截方法。比较少用到
                // cancel() {}
                };
                return new grpc_js_1.InterceptingCall(nextCall(options), requester);
            }
        ]
        // 设置timeout的deadline
        // callInvocationTransformer: (callProperties:CallProperties<any, any>)=>{
        //   callProperties.callOptions.deadline = new Date().getTime() + 3600;
        //   return callProperties;
        // }
    };
};
