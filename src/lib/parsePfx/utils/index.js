'use strict';

const child_process = require('child_process');

function exec (command) {
  return new Promise((resolve, reject) => {
    try {
        child_process.exec(command, (err, stdout) => {
          if (err) resolve({err});
          resolve({stdout});
        });
    } catch(err) {
      resolve({err});
    }
  })
}

function removeBagAttributes(content) {
  let title;
  const BABELS = ['CERTIFICATE', 'PRIVATE KEY', 'RSA PRIVATE KEY']
  for (const babel of BABELS) {
    if (content.indexOf(babel) > -1) {
      title = babel;
      break 
    }
  }

  const regexp = new RegExp('-----BEGIN ' + title + '-----(.*)-----END ' + title + '-----');

  content = content.replace(/\r\n/g, '');
  content = regexp.exec(content) || [];
  content = content[1].split('');
  content = chop(content, 76);
  content = content.map(line => line.join('')).join('\n');

  return '-----BEGIN ' + title + '-----\n' + content + '\n' + '-----END ' + title + '-----';
}

function chop(array, quantity) {
  const result = [];
  let subArray = [];
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

export {
    exec,
    removeBagAttributes
}