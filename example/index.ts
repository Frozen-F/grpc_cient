import Cipher from '../src/cipher';
const path = require('path');

// 对称加密解密
async function symmEncryptAndsymmDecrypt(client:Cipher) {
  const { err, response } = await client.symmEncrypt({ plainText: '12345678' });
  console.log('symmEncrypt', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.symmDecrypt({ cipherText: response.cipherText });
  console.log('symmDecrypt', decrypt);
}


// 非对称加密解密
async function asymEncryptAndasymDecrypt(client:Cipher) {
  const { err, response } = await client.asymEncrypt({ plainText: '12345678' });
  console.log('asymEncrypt', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.asymDecrypt({ cipherText: response.cipherText });
  console.log('asymDecrypt', decrypt);
}

// 签名验签
// todo 验签未通
async function signAnyVerifyData(client:Cipher) {
  const { err, response } = await client.signData({ plainText: '12345678' });
  console.log('signData', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.verifySignedData({
    certId: 'default',
    plainText: '1',
    signText: response.signText,
    certPath: path.join(__dirname, '../certs/cacert.pem'),
    verifyLevel: 1
  });
  console.log('verifySignedData', decrypt);
}

// MAC计算与验证
// todo 没通client无calculateMAC和verifyMAC需要改首字母大写···但是calculateMAC会报错
async function calculateAnyVerifyMac(client:Cipher) {
  const { err, response } = await client.calculateMAC({ keyId: 'default', macAlg: '0x00000001', plainText: '1234565' });
  console.log('calculateMAC', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.verifyMAC({
    keyId: 'default',
    macAlg: '0x00000001',
    plainText: '1234565',
    macText: response?.macText
  });
  console.log('verifyMAC', decrypt);
}

// 数字信封解密解密
async function evpEncryptDataAndevpDecryptData(client:Cipher) {
  const { err, response } = await client.evpEncryptData({
    envelopeId: '123456789123',
    receiverId: '1',
    plainText: '12345678'
  });
  console.log('evpEncryptData', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.evpDecryptData({
    envelopeId: '123456789123',
    cipherText: response.cipherText
  });
  console.log('evpDecryptData', decrypt);
}


async function main() {
  const client = await new Cipher({
    addr: '10.48.57.27:8443',
    rootCertPath: path.join(__dirname, '../certs/cacert.pem'),
    clientStorePath: path.join(__dirname, '../certs/client.pfx'),
    authority: 'quickservice',
    timeout: 50000
  }).init();

  // await symmEncryptAndsymmDecrypt(client);
  // await asymEncryptAndasymDecrypt(client);
  // await signAnyVerifyData(client);
  // await calculateAnyVerifyMac(client);
  await evpEncryptDataAndevpDecryptData(client);
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
