/* *
 * 密码客户端实例
 * */
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


enum Status {
  success = 1,
  error = 0,
  serveErr = 2
}


class CryptoClient {
  private PROTO_PATH = path.join(__dirname, '../protos/Hello.proto');
  private SERVE_URI = 'localhost:50051';
  private PACKAGE_NAME = 'hello';
  public client;

  constructor() {
    const { PROTO_PATH, PACKAGE_NAME } = this;
    const packageDefinition = protoLoader.loadSync(
      PROTO_PATH,
      {
        keepCase: true, /**保持字段大小写，而不是转换为驼色大小写*/
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
        
    const HelloProto = grpc.loadPackageDefinition(packageDefinition)[PACKAGE_NAME];
    this.client = new HelloProto.MainGreeter(this.SERVE_URI, grpc.credentials.createInsecure());
    return this;
  }

  private myProxy(fun:string, ...arg:any[]): Promise<{status: Status, response?:any, err?:any}> {
    return new Promise((resolve)=>{
      try {
        this.client[fun](...arg, (err:any, response:any)=>{
          if (err) {
            resolve({
              status: Status.error,
              err
            });
          };
          resolve({
            status: Status.success,
            response
          });
        });
      } catch (err: any) {
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
  public close():void {
    if (!this.client) return;
    this.client.close();
  }

  async sayHello(name: string) {
    const { status, response, err } = await this.myProxy('sayHello', { name });
    console.log(status, response, err);
    return;
  }
};

export default CryptoClient;
