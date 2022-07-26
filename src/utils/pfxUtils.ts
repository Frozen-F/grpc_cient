import { getPrivateKey, getCertificate } from './parsePfx';

const parsePfx = async(path:string, password:string = ''):Promise<Record<'privateKey'| 'certificate', string>>=>{
  if (!path) throw new Error('The path cannot be empty');
  const params = {
    path,
    password
  };
  return {
    privateKey: await getPrivateKey(params),
    certificate: await getCertificate(params)
  };
};

export {
  parsePfx    
};
