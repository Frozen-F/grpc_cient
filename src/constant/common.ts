// 应答
export interface Reply<T> {
  response: T,
  err?: Error
}

// 客户端配置
export interface ClientOption {
  uri: string | string[];
  config: Config; // proto配置
  ssl?: {
    rootCertPath?: string;
    privateKeyPath?: string;
    authority?: string;
    isOpen: boolean;
  };
  timeout?: number;
}

export interface Config {
  PROTO_PATH: string,
  PACKAGE_NAME: string;
  SERVE_NAME: string;
  PFX_CODE?: string;
}
