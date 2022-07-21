import { Helper, Client } from '../src/index.js';
// const a = require('../dist')

function main() {
  // console.log(a)
  console.log('sd---------------------------------------------sdfdsf');
  new Helper();
  const client = new Client();
  client.sayHello('sdfdsf');
  client.close();

}
main();
