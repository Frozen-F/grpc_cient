const path = require('path');
import CipherClient from '../src/index';
import { symmetry, asymmetric, signature, mac, envelope, timeStamp } from './utils';


async function main() {
  const client = await new CipherClient({
    // addr: '10.48.57.27:8443',
    addr: '10.48.57.26:9527',
    rootCertPath: path.join(__dirname, '../certs/cacert.pem'),
    clientStorePath: path.join(__dirname, '../certs/client.pfx'),
    authority: 'quickservice',
    timeout: 50000
  }).init();

  // 对称加密解密;
  await symmetry(client);
  // 非对称加密解密
  await asymmetric(client);
  // 签名验签
  await signature(client);
  // MAC计算与验证
  await mac(client);
  // 数字信封解密解密
  await envelope(client);
  // 时间戳
  await timeStamp(client);
  
  client.close();
}
main();
