'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const async = require('async');
const x509 = require('x509.js');
const { removeBagAttributes, exec } = require('./utils/index');
function key(cb, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -nocerts ',
            '-passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return cb(err);
        cb(null, removeBagAttributes(stdout));
    });
}
function attributes(cb, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return cb(err);
        cb(null, x509.parseCert(stdout));
    });
}
function certificate(cb, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -clcerts -nokeys',
            '-passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return cb(err);
        cb(null, removeBagAttributes(stdout));
    });
}
function toPem(params) {
    return new Promise((resolve, reject) => {
        params.path = `"${params.path}"`;
        async.parallel({
            attributes: cb => attributes(cb, params),
            key: cb => key(cb, params),
            certificate: cb => certificate(cb, params)
        }, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}
module.exports.toPem = toPem;
