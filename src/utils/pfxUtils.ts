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


const parsePfx = async(path:string, password:string = ''):Promise<Record<'privateKey'| 'certificate', string>>=>{
  if (!path) throw new Error('The path cannot be empty');
  const { pemKey, pemCertificate } = p12.getPemFromP12(path, password);
  return {
    privateKey: pemKey,
    certificate: pemCertificate
  };
};

export {
  parsePfx    
};
