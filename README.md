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
interface Config {
  PROTO_PATH: string, // proto文件地址
  PACKAGE_NAME: string; // proto文件对应package
  SERVE_NAME: string; // 服务名称
}


// 客户端配置
interface ClientOption {
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

const client = await new ServeClient(option: ClientOption).initClient()

