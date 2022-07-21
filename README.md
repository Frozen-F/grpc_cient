# grpc客户端

> node版本基于服务端提供protos快速建立连接的客户端中间件.
> [grpc文档]（https://www.grpc.io/docs/languages/node/）
> [grpc中文文档](http://doc.oschina.net/grpc?t=60135)
> [grpc github](https://github.com/grpc/grpc)

### 准备
```
1、启动客户端（可跟根据官方实例确保服务端已启动）
2、导入proto文件
3、修改./src/config/index.ts中配置信息
```

### 使用

``` bash
export interface Config {
  PROTO_PATH: string,
  PACKAGE_NAME: string;
  SERVE_NAME: string;
  PFX_CODE?: string;
}


interface ClientOption {
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

const client = await new ServeClient(ClientOption).initClient()

