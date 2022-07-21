import Cipher from '../src/cipher';
import Serve from '../src/serve';
import projectConfig from '../src/config';
import { buffer } from 'stream/consumers';
const path = require('path');

async function main() {
  const client = await new Cipher({
    addr: '10.48.57.27:8443',
    rootCertPath: '../certs/cacert.pem',
    clientStorePath: '../certs/client.pfx',
    authority: 'quickservice',
    timeout: 50000
  }).init();
  const { err, response } = await client.asymEncrypt({ plainText: '12345678' });
  console.log('asymEncrypt', err, response.cipherText);
  const asymDecrypt = await client.asymDecrypt({ cipherText: response.cipherText });
  console.log('asymDecrypt', asymDecrypt.response);
  client.close();

  // const client = await new Serve({
  //   uri: '0.0.0.0:50051',
  //   timeout: 50000,
  //   config: {
  //     PROTO_PATH: path.join(__dirname, '../../protos/Hello.proto'),
  //     PACKAGE_NAME: 'hello',
  //     SERVE_NAME: 'MainGreeter',
  //     PFX_CODE: ''
  //   }
  // }).initClient();
  // const a = await client.myProxy('sayHello', { name: 'ddsf' });
  // console.log('eeeeee', a);
  // client.close();
}
main();


// function hello (call, callback) { 
//   console.log(call.request.message)
// }
// server.addService(
//   client.Hello.service,
//   {hello: hello}
// );
// server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
// server.start();
// grpcClient = new client.Hello('localhost:50051',
//   grpc.credentials.createInsecure(),
//   {deadline: new Date().getSeconds()+5}
// ); // grpcClient.hello({message: "abc"}, function(err, response) { console.log(response) // doesn't reach here because function hello doesn't callback }) 
