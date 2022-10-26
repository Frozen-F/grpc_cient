const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
import * as async from 'async';
import * as lodash from 'lodash';

const config = {
  host: '0.0.0.0',
  port: 50051,
  packageName: 'hello',
  serveName: 'MainGreeter'
};

let cnt = 1;

function sayHello(call:any, callback:any) {
  console.log('server', call.request);
  callback(null, { message: `[${cnt++}] echo: ` + call.request.name });
}

function sayMultiHello(call:any, callback:any) {
  const names:string[] = [];
  call.on('data', (data:Record<string, any>) => {
    console.log(`get name: ${data.name}`);
    names.push(data.name);
  });
  call.on('end', ()=>{
    const res = { message: 'Hello ' + names.join(',') };
    callback(null, res);
  });
}

function receiveMultiHello(call:any, callback:any) {
  console.log('server', call.request);
  const senders: any[] = [];
  for (var i = 0; i < 10; i++) {
    senders[i] = (function(i) {
      return (callback:any)=>{
        call.write({ message: 'Hello ' + `name${i}` });
        lodash.delay(callback, 1000);
      };
    }(i));
  }
  async.series(senders, () => {
    call.end();
  });
}

function main() {
  const PROTO_PATH = path.join(__dirname, './protos/Hello.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  const helloProto = protoDescriptor[config.packageName];

  var server = new grpc.Server();
  server.addService(helloProto[config.serveName].service, { sayHello, sayMultiHello, receiveMultiHello });
  server.bindAsync(`${config.host}:${config.port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`grpc server started: ${config.host}:${config.port}`);        
  });
}

main();
