grpc-client
===

node版本基于服务端提供protos快速建立连接的客户端中间件.

[api](https://www.grpc.io/docs/languages/node/) [api(中文)](http://doc.oschina.net/grpc?t=60135) [github](https://github.com/grpc/grpc)

## Installation

Install with npm

    npm install @fxs0819/grpc-client


:warning: 请确保您的系统/容器上已经安装了' openssl '

## Examples

```javascript
const config = {
    uri: '0.0.0.0:50051',
    ssl: {
        isOpen: false
        // rootCertPath: path.join(__dirname, './certs/cacert.pem'),
        // clientStorePath: path.join(__dirname, './certs/client.pfx'),
        // pfxCode: 'qianxin.quick.50843197',
        // authority: 'quickservice'
    },
    timeout: 5000,
    config: {
        PROTO_PATH: path.join(__dirname, './protos/Hello.proto'),
        PACKAGE_NAME: 'hello',
        SERVE_NAME: 'MainGreeter'
    }
};
const client:Client = await new Client(config);
const res = await client.myProxy('sayHello', { 'name': 'Tom' });
console.log(res);
client.close();
```

## License

**MIT**
