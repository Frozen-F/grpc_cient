"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificate = exports.getPrivateKey = exports.getAttributes = void 0;
const x509 = require('x509.js');
const childProcess = require('child_process');
function exec(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                childProcess.exec(command, (err, stdout) => {
                    if (err)
                        resolve({ err, stdout });
                    resolve({ err, stdout });
                });
            }
            catch (err) {
                resolve({ err, stdout: null });
            }
        });
    });
}
function removeBagAttributes(content) {
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
    content = content.map((line) => line.join('')).join('\n');
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
    if (subArray.length > 0)
        result.push(subArray);
    return result;
}
;
function getAttributes(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return err;
        return x509.parseCert(stdout);
    });
}
exports.getAttributes = getAttributes;
function getPrivateKey(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -nocerts ',
            '-passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return err;
        return removeBagAttributes(stdout);
    });
}
exports.getPrivateKey = getPrivateKey;
function getCertificate(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = [
            'openssl pkcs12 -in',
            params.path,
            '-nodes -clcerts -nokeys',
            '-passin pass:' + (params.password || '')
        ].join(' ');
        const { err, stdout } = yield exec(command);
        if (err)
            return err;
        return removeBagAttributes(stdout);
    });
}
exports.getCertificate = getCertificate;
