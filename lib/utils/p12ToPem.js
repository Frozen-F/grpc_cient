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
exports.getPemFromP12 = void 0;
const forge = __importStar(require("node-forge"));
const fs = __importStar(require("fs"));
function getKeyFromP12(p12, password) {
    const keyData = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag }, password);
    let pkcs8Key = keyData[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    if (typeof pkcs8Key === 'undefined') {
        pkcs8Key = keyData[forge.pki.oids.keyBag][0];
    }
    if (typeof pkcs8Key === 'undefined') {
        throw new Error('Unable to get private key.');
    }
    let pemKey = forge.pki.privateKeyToPem(pkcs8Key.key);
    pemKey = pemKey.replace(/\r\n/g, '');
    return pemKey;
}
function getCertificateFromP12(p12) {
    const certData = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certificate = certData[forge.pki.oids.certBag][0];
    let pemCertificate = forge.pki.certificateToPem(certificate.cert);
    pemCertificate = pemCertificate.replace(/\r\n/g, '');
    const commonName = certificate.cert.subject.attributes[0].value;
    return { pemCertificate, commonName };
}
function convertToPem(p12base64, password) {
    const p12Asn1 = forge.asn1.fromDer(p12base64);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    const pemKey = getKeyFromP12(p12, password);
    const { pemCertificate, commonName } = getCertificateFromP12(p12);
    return { pemKey, pemCertificate, commonName };
}
function getPemFromP12(certPath, password) {
    const p12File = fs.readFileSync(certPath, { encoding: 'binary' });
    return convertToPem(p12File, password);
}
exports.getPemFromP12 = getPemFromP12;
