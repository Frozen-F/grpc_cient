// 数字信封相关
import CipherClient from '../../src/index';

export default async function evpEncryptDataAndevpDecryptData(client:CipherClient) {
  const { err, response } = await client.evpEncryptData({
    envelopeId: '12345678',
    receiverId: 'qmtest',
    plainText: '12345678'
  });
  console.log('数字信封加密：', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.evpDecryptData({
    envelopeId: '12345678',
    cipherText: response.cipherText
  });
  console.log('数字信封解密：', decrypt);
}
