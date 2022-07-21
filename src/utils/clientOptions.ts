import { InterceptorOptions, InterceptingCall, ClientOptions } from '@grpc/grpc-js';


/**
 *  @describe grpc客户端配置的options
  * @param timeout 超时
  */
export default ({ timeout = 2000, ssl }: {timeout:number, ssl: Record<string, any> }): ClientOptions=>{
  return {
    'grpc.ssl_target_name_override': ssl.authority, 
    // 拦截器
    interceptors: [
      (options:InterceptorOptions, nextCall:Function): InterceptingCall=>{
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
        return new InterceptingCall(nextCall(options), requester);
      }
    ]
    // 设置timeout的deadline
    // callInvocationTransformer: (callProperties:CallProperties<any, any>)=>{
    //   callProperties.callOptions.deadline = new Date().getTime() + 3600;
    //   return callProperties;
    // }
  };
};
