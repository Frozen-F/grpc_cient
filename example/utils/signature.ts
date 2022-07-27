// 签名验签相关
import CipherClient from '../../src/index';

export default async function signAnyVerifyData(client:CipherClient) {
  const { err, response } = await client.signData({ plainText: '12345678' });
  console.log('签名：', { err, response });
  if (err || !response) {
    return;
  }
  const verifySignedData = await client.verifySignedData({
    plainText: '12345678',
    signText: response.signText
  });
  console.log('验签：', verifySignedData);
}
