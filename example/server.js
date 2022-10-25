const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const config = {
  host: '0.0.0.0',
  port: 50051,
  packageName: 'hello',
  serveName: 'MainGreeter'
};

let cnt = 1;

function sayHello(call, callback) {
  console.log('server', call.request);
  callback(null, { message: `[${cnt++}] echo: ` + call.request.name });
}

function sayMultiHello(call, callback) {
  const names = [];
  call.on('data', data => {
    console.log(`get name: ${data.name}`);
    names.push(data.name);
  });
  call.on('end', ()=>{
    const res = { message: 'Hello ' + names.join(',') };
    callback(null, res);
  });
}


function main() {
  const PROTO_PATH = path.join(__dirname, './protos/Hello.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  const helloProto = protoDescriptor[config.packageName];

  var server = new grpc.Server();
  server.addService(helloProto[config.serveName].service, { sayHello, sayMultiHello });
  server.bindAsync(`${config.host}:${config.port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`grpc server started: ${config.host}:${config.port}`);        
  });
}

main();
