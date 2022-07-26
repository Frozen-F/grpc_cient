import { ClientOptions } from '@grpc/grpc-js';
/**
 *  @describe grpc客户端配置的options
  * @param timeout 超时
  */
declare const _default: ({ timeout, ssl }: {
    timeout: number;
    ssl: Record<string, any>;
}) => ClientOptions;
export default _default;
