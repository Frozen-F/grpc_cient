// 时间戳相关
import CipherClient from '../../src/index';

// todo未调试
export default async function createAndVerifyAndDetailTS(client: CipherClient) {
  const { err, response } = await client.createTS({
    plainText: '12345678'
  });
  console.log('创建时间戳：', { err, response });
  if (err || !response) {
    return;
  }
  const verifyTS = await client.verifyTS({
    // tsText: response.tsText
    tsText: Buffer.from('ssdds')
  });
  console.log('验证时间戳：', verifyTS);
  const getTSDetailInfo = await client.getTSDetailInfo({
    // tsText: response.tsText,
    tsText: Buffer.from('ssdds'),
    itemNum: 'QK_ITEMNUM_UNSPECIFIED'
  });
  console.log('时间戳详情：', getTSDetailInfo);
}
