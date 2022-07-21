const Pfx = require('../lib/parsePfx');

interface Reply {
  privateKey: string;
  certificate: string;
}

const parsePfx = async(path:string, password:string = ''):Promise<Reply>=>{
  if (!path) throw new Error('The path cannot be empty');
  const { key: privateKey, certificate } = await Pfx.toPem({
    path,
    password
  });

  return {
    privateKey,
    certificate
  };
};

export {
  parsePfx    
};
