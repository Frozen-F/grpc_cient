'use strict';

const async = require('async');
const x509 = require('x509.js');
const {removeBagAttributes, exec} = require('./utils/index');

async function key(cb, params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -nocerts ',
    '-passin pass:' + (params.password || '')
  ].join(' ');

  const {err, stdout} =await exec(command)
  if (err) return cb(err);
  cb(null, removeBagAttributes(stdout));
}

async function attributes(cb, params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -passin pass:' + (params.password || '')
  ].join(' ');

  const {err, stdout} =await exec(command)
  if (err) return cb(err);
  cb(null, x509.parseCert(stdout));
}


async function certificate(cb, params) {
  const command = [
    'openssl pkcs12 -in',
    params.path,
    '-nodes -clcerts -nokeys',
    '-passin pass:' + (params.password || '')
  ].join(' ');

  const {err, stdout} =await exec(command)
  if (err) return cb(err);
  cb(null, removeBagAttributes(stdout));
}

function toPem(params) {
  return new Promise((resolve, reject) => {
    params.path = `"${params.path}"`;

    async.parallel({
      attributes: cb => attributes(cb, params),
      key: cb => key(cb, params),
      certificate: cb => certificate(cb, params)
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

  });
}

module.exports.toPem = toPem;