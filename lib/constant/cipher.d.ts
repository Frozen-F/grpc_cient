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
declare type MacAlg = 'QK_HMAC_SM3' | 'QK_CBC_MAC_SM4';
declare type ItemNum = 'QK_ITEMNUM_UNSPECIFIED' | 'QK_STF_TIME_OF_STAMP' | 'QK_STF_CN_OF_TSSIGNER' | 'QK_STF_ORINGINAL_DATA' | 'QK_STF_CERT_OF_TSSERVER' | 'QK_STF_CERTCHAIN_OF_TSSERVER' | 'QK_STF_SOURCE_OF_TIME' | 'QK_STF_TIME_PRECISION' | 'QK_STF_RESPONSE_TYPE' | 'QK_STF_SUBJECT_COUNTRY_OF_TSSIGNER' | 'QK_STF_SUBJECT_ORGNIZATION_OF_TSSIGNER' | 'QK_STF_SUBJECT_CITY_OF_TSSIGNER' | 'QK_STF_SUBJECT_EMAIL_OF_TSSIGNER';
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
    plainText: string;
    signText: Buffer;
    certId?: string;
    certPath?: string;
    verifyLevel?: VerifyCertLevel;
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
