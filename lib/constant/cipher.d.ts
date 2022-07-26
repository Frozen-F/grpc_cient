/// <reference types="node" />
export interface Option {
    addr: string;
    rootCertPath: string;
    clientStorePath: string;
    authority?: string;
    timeout?: number;
}
declare type SymAlgPaddingMode = 0 | 1 | 2 | 3;
declare type VerifyCertLevel = 0 | 1 | 2;
declare type MacAlg = '0x00000000' | '0x00000001' | '0x00000002' | '0x00000003' | '0x00000004' | '0x00000005' | '0x00000006';
declare type ItemNum = '0x00000000' | '0x00000001' | '0x00000002' | '0x00000003' | '0x00000004' | '0x00000005' | '0x00000006' | '0x00000007' | '0x00000008' | '0x00000009' | '0x0000000A' | '0x0000000B' | '0x0000000C';
export interface SymmEncryptRequest {
    plainText: string;
    keyId?: string;
    alg?: string;
    iv?: string;
    padding?: SymAlgPaddingMode;
}
export interface SymmEncryptResponse {
    cipherText: Buffer;
}
export interface SymmDecryptRequest {
    cipherText: Buffer;
    keyId?: string;
    alg?: string;
    iv?: string;
    padding?: SymAlgPaddingMode;
}
export interface SymmDecryptResponse {
    plainText: string;
}
export interface AsymEncryptRequest {
    plainText: string;
    certId?: string;
}
export interface AsymEncryptResponse {
    cipherText: Buffer;
}
export interface AsymDecryptRequest {
    cipherText: Buffer;
}
export interface AsymDecryptResponse {
    plainText: string;
}
export interface SignDataRequest {
    plainText: string;
}
export interface SignDataResponse {
    signText: Buffer;
}
export interface VerifySignedDataRequest {
    certId: string;
    plainText: string;
    signText: Buffer;
    certPath: string;
    verifyLevel: VerifyCertLevel;
}
export interface VerifySignedDataResponse {
    verifyResult: boolean;
}
export interface CalculateMACRequest {
    keyId: string;
    macAlg: MacAlg;
    plainText: string;
}
export interface CalculateMACResponse {
    macText: Buffer;
}
export interface VerifyMACRequest {
    keyId: string;
    macAlg: MacAlg;
    plainText: string;
    macText: Buffer;
}
export interface VerifyMACResponse {
    verifyResult: Boolean;
}
export interface EvpEncryptDataRequest {
    envelopeId: string;
    receiverId: string;
    plainText: string;
}
export interface EvpEncryptDataResponse {
    cipherText: Buffer;
}
export interface EvpDecryptDataRequest {
    envelopeId: string;
    cipherText: Buffer;
}
export interface EvpDecryptDataResponse {
    plainText: string;
}
export interface CreateTSRequest {
    plainText: string;
}
export interface CreateTSResponse {
    tsText: Buffer;
}
export interface VerifyTSRequest {
    tsText: Buffer;
}
export interface VerifyTSResponse {
    verifyResult: Boolean;
}
export interface GetTSDetailInfoRequest {
    tsText: Buffer;
    itemNum: ItemNum;
}
export interface GetTSDetailInfoResponse {
    itemValue: Buffer;
}
export {};
