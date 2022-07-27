// MAC 相关相关
import CipherClient from '../../src/index';

export default async function calculateAnyVerifyMac(client:CipherClient) {
  let { err, response } = await client.calculateMAC({ keyId: 'default', macAlg: 'QK_HMAC_SM3', plainText: 'asd' });
  console.log('计算 MAC：', { err, response });
  if (err || !response) {
    return;
  }
  const verifyMAC = await client.verifyMAC({
    keyId: 'default',
    macAlg: 'QK_HMAC_SM3',
    plainText: 'asd',
    macText: response?.macText
  });
  console.log('验证 MAC：', verifyMAC);
}
