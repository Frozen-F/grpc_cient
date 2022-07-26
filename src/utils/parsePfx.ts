const x509 = require('x509.js');
const childProcess = require('child_process');

interface Params {
  path:string,
  password:string
}

async function exec (command:string):Promise<{err:any, stdout:any }> {
  return new Promise((resolve, reject) => {
    try {
      childProcess.exec(command, (err:Error, stdout:any) => {
        if (err) resolve({ err, stdout });
        resolve({ err, stdout });
      });
    } catch (err) {
      resolve({ err, stdout: null });
    }
  });
}

function removeBagAttributes(content:any) {
  let title;
  const BABELS = ['CERTIFICATE', 'PRIVATE KEY', 'RSA PRIVATE KEY'];
  for (const babel of BABELS) {
    if (content.indexOf(babel) > -1) {
      title = babel;
      break; 
    }
  }

  const regexp = new RegExp('-----BEGIN ' + title + '-----(.*)-----END ' + title + '-----');

  content = content.replace(/\r\n/g, '');
  content = regexp.exec(content) || [];
  content = content[1].split('');
  content = chop(content, 76);
  content = content.map((line:any[]) => line.join('')).join('\n');

  return '-----BEGIN ' + title + '-----\n' + content + '\n' + '-----END ' + title + '-----';
}

function chop(array:any[], quantity: number) {
  const result = [];
  let subArray:any[] = [];
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

  if (subArray.length > 0) result.push(subArray);

  return result;
};

async function getAttributes(params: Params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -passin pass:' + (params.password || '')
  ].join(' ');

  const { err, stdout } = await exec(command);
  if (err) return err;
  return x509.parseCert(stdout);
}

async function getPrivateKey(params: Params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -nocerts ',
    '-passin pass:' + (params.password || '')
  ].join(' ');

  const { err, stdout } = await exec(command);
  if (err) return err;
  return removeBagAttributes(stdout);
}

async function getCertificate(params: Params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -clcerts -nokeys',
    '-passin pass:' + (params.password || '')
  ].join(' ');

  const { err, stdout } = await exec(command);
  if (err) return err;
  return removeBagAttributes(stdout);
}

export {
  getAttributes,
  getPrivateKey,
  getCertificate
};
