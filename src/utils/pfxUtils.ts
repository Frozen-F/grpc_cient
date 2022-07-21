const Pfx = require('../lib/parsePfx');

interface Reply {
  key: string;
  certificate: string
  attributes: Record<string, any>
}

const parsePfx = async(path:string, password:string = ''):Promise<Reply>=>{
  if (!path) throw new Error('The path cannot be empty');
  const res = await Pfx.toPem({
    path,
    password
  });
  return res;
};

export {
  parsePfx    
};
