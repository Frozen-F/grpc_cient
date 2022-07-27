// 非对称相关
import CipherClient from '../../src/index';

export default async function asymEncryptAndasymDecrypt(client:CipherClient) {
  const { err, response } = await client.asymEncrypt({ plainText: '12345678' });
  console.log('非对称加密：', { err, response });
  if (err || !response) {
    return;
  }
  const decrypt = await client.asymDecrypt({ cipherText: response.cipherText });
  console.log('非对称解密：', decrypt);
}
