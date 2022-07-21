// 应答
export interface Reply<T> {
  response: T,
  err?: Error
}

export interface Config {
  PROTO_PATH: string, // proto文件地址
  PACKAGE_NAME: string; // proto文件对应package
  SERVE_NAME: string; // 服务名称
}


// 客户端配置
export interface ClientOption {
  uri: string | string[];
  config: Config; // proto配置
  ssl?: {
    rootCertPath?: string; // 根证书
    clientStorePath?: string; // 私钥和证书文件地址
    authority?: string; // grpc.ssl_target_name_override
    pfxCode?: string; // 私钥和证书文件（pfx）解析需要的密码
    isOpen: boolean; // 默认为false
  };
  timeout?: number; // 单次grpc timeout
}

