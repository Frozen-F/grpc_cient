"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePfx = void 0;
const p12 = __importStar(require("./p12ToPem"));
function parseContent(content) {
    let title;
    const BABELS = ['CERTIFICATE', 'RSA PRIVATE KEY', 'PRIVATE KEY'];
    for (const babel of BABELS) {
        if (content.indexOf(babel) > -1) {
            title = babel;
            break;
        }
    }
    const regexp = new RegExp(`-----BEGIN ${title}-----(.*)-----END ${title}-----`);
    content = content.replace(/\r\n/g, '');
    let contentList = regexp.exec(content) || [];
    contentList = contentList[1].split('');
    contentList = chop(contentList, 76);
    content = contentList.map((line) => line.join('')).join('\n');
    return `-----BEGIN ${title}-----\n${content}\n-----END ${title}-----`;
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
const parsePfx = (path, password = '') => {
    if (!path)
        throw new Error('The path cannot be empty');
    const { pemKey, pemCertificate } = p12.getPemFromP12(path, password);
    return {
        privateKey: parseContent(pemKey),
        certificate: parseContent(pemCertificate)
    };
};
exports.parsePfx = parsePfx;
