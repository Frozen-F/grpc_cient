import Cipher from '../src/cipher';
// import Cipher from './lib/bundle.js';
// import Cipher from '../lib/cipher';
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


// // 非对称加密解密
// async function asymEncryptAndasymDecrypt(client:Cipher) {
//   const { err, response } = await client.asymEncrypt({ plainText: '12345678' });
//   console.log('asymEncrypt', { err, response });
//   if (err || !response) {
//     return;
//   }
//   const decrypt = await client.asymDecrypt({ cipherText: response.cipherText });
//   console.log('asymDecrypt', decrypt);
// }

// // 签名验签
// async function signAnyVerifyData(client:Cipher) {
//   const { err, response } = await client.signData({ plainText: '12345678' });
//   console.log('signData', { err, response });
//   if (err || !response) {
//     return;
//   }
//   const verifySignedData = await client.verifySignedData({
//     plainText: '12345678',
//     signText: response.signText
//   });
//   console.log('verifySignedData', verifySignedData);
// }

// // MAC计算与验证
// async function calculateAnyVerifyMac(client:Cipher) {
//   let { err, response } = await client.calculateMAC({ keyId: 'default', macAlg: 'QK_HMAC_SM3', plainText: 'asd' });
//   console.log('calculateMAC1', { err, response });
//   if (err || !response) {
//     return;
//   }
//   const verifyMAC = await client.verifyMAC({
//     keyId: 'default',
//     macAlg: 'QK_HMAC_SM3',
//     plainText: 'asd',
//     macText: response?.macText
//   });
//   console.log('verifyMAC', verifyMAC);
// }

// // 数字信封解密解密
// async function evpEncryptDataAndevpDecryptData(client:Cipher) {
//   const { err, response } = await client.evpEncryptData({
//     envelopeId: '12345678',
//     receiverId: 'qmtest',
//     plainText: '12345678'
//   });
//   console.log('evpEncryptData', { err, response });
//   if (err || !response) {
//     return;
//   }
//   const decrypt = await client.evpDecryptData({
//     envelopeId: '12345678',
//     cipherText: response.cipherText
//   });
//   console.log('evpDecryptData', decrypt);
// }

// // 时间戳
// // todo未调试
// async function createAndVerifyAndDetailTS(client:Cipher) {
//   const { err, response } = await client.createTS({
//     plainText: '12345678'
//   });
//   console.log('createTS', { err, response });
//   if (err || !response) {
//     return;
//   }
//   const verifyTS = await client.verifyTS({
//     // tsText: response.tsText
//     tsText: Buffer.from('ssdds')
//   });
//   console.log('verifyTS', verifyTS);
//   const getTSDetailInfo = await client.getTSDetailInfo({
//     // tsText: response.tsText,
//     tsText: Buffer.from('ssdds'),
//     itemNum: 'QK_ITEMNUM_UNSPECIFIED'
//   });
//   console.log('getTSDetailInfo', getTSDetailInfo);
// }

async function main() {
  const client = await new Cipher({
    // addr: '10.48.57.27:8443',
    addr: '10.48.57.26:9527',
    rootCertPath: path.join(__dirname, '../certs/cacert.pem'),
    clientStorePath: path.join(__dirname, '../certs/client.pfx'),
    authority: 'quickservice',
    timeout: 50000
  }).init();

  // 对称加密解密
  await symmEncryptAndsymmDecrypt(client);
  // // 非对称加密解密
  // await asymEncryptAndasymDecrypt(client);
  // // 签名验签
  // await signAnyVerifyData(client);
  // // MAC计算与验证
  // await calculateAnyVerifyMac(client);
  // // 数字信封解密解密
  // await evpEncryptDataAndevpDecryptData(client);
  // // 时间戳
  // await createAndVerifyAndDetailTS(client);
  
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
