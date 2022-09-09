import * as p12 from 'p12-pem';
// import pem, { Pkcs12ReadResult } from 'pem';

// const parsePfxUtil = (path:string, password:string):Promise<Pkcs12ReadResult>=>{
//   return new Promise((resolve, reject)=>{
//     pem.readPkcs12(path, { p12Password: password }, (err:any, res:Pkcs12ReadResult) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(res);
//     });
//   });
// };

function parseContent(content:string) {
  let title;
  const BABELS = ['CERTIFICATE', 'RSA PRIVATE KEY', 'PRIVATE KEY'];
  for (const babel of BABELS) {
    if (content.indexOf(babel) > -1) {
      title = babel;
      break;
    }
  }
  const regexp = new RegExp(`-----BEGIN ${title}-----(.*)-----END ${title}-----`);
  content = content.replace(/\r\n/g, '');
  let contentList:any[] = regexp.exec(content) || [];
  contentList = contentList[1].split('');
  contentList = chop(contentList, 76);
  content = contentList.map((line:string[]) => line.join('')).join('\n');
  return `-----BEGIN ${title}-----\n${content}\n-----END ${title}-----`;
}
function chop(array:string[], quantity:number) {
  const result:string[][] = [];
  let subArray:string[] = [];
  let count = 0;
  array.forEach(element => {
    if (count === quantity) {
      result.push(subArray);
      subArray = [];
      count = 0;
    }
    subArray.push(element);
    count++;
  });
  if (subArray.length > 0)
    result.push(subArray);
  return result;
}

const parsePfx = (path:string, password:string = ''):Record<'privateKey'| 'certificate', string>=>{
  if (!path) throw new Error('The path cannot be empty');
  const { pemKey, pemCertificate } = p12.getPemFromP12(path, password);
  return {
    privateKey: parseContent(pemKey),
    certificate: parseContent(pemCertificate)
  };
};

export {
  parsePfx    
};
