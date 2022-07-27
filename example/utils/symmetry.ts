// 对称相关
import CipherClient from '../../src/index';

export default async function symmEncryptAndsymmDecrypt(client:CipherClient) {
  const { err, response } = await client.symmEncrypt({ plainText: '12345678' });
  console.log('对称加密：', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.symmDecrypt({ cipherText: response.cipherText });
  console.log('对称解密：', decrypt);
}
