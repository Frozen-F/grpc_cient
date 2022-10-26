const path = require('path');
import { Client } from '../src/index';
import { PassThrough } from 'stream';
import * as lodash from 'lodash';
import * as async from 'async';

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
    config: {
      PROTO_PATH: path.join(__dirname, './protos/Hello.proto'),
      PACKAGE_NAME: 'hello',
      SERVE_NAME: 'MainGreeter'
    }
  };
  const client:Client = new Client(config);
  const deadline = new Date().getTime() + 1000;
  await client.waitForReady(deadline);
  // await sayHello(client);
  await sayMultiHello(client);
  // await receiveMultiHello(client);
  client.close();

}

async function sayHello(client:Client) {
  const deadline = new Date().getTime() + 1000;
  const res = await client.myProxy('sayHello', { 'name': 'Tom' }, { deadline });
  console.log(res);
}

async function sayMultiHello(client:Client) {
  const stream = new PassThrough({ objectMode: true });
  const sayMultiHelloCall = client.myProxy('sayMultiHello', stream);
  const senders: any[] = [];
  for (var i = 0; i < 10; i++) {
    senders[i] = (function(i) {
      return (callback:any)=>{
        stream.write({ name: `name${i}` });
        lodash.delay(callback, 1000);
      };
    }(i));
  }
  async.series(senders, () => {
    stream.end();
  });
  const sayMultiHello = await sayMultiHelloCall;
  console.log(sayMultiHello);
}

async function receiveMultiHello(client:Client) {
  const call = client.client?.receiveMultiHello({ 'name': 'Tom' });
  call.on('data', function(data:any) {
    console.log(data);
  });

  call.on('end', ()=>{
    console.log('end');
  });
}
main();
