const path = require('path');
import { Client } from '../src/index';

async function main() {
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
  const client:Client = await new Client(config).init();
  const res = await client.myProxy('sayHello', { 'name': 'Tom' });
  console.log(res);
  client.close();
}
main();
