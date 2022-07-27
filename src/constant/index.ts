export interface Option {
  addr: string,
  rootCertPath: string,
  clientStorePath: string,
  authority?: string,
  timeout?: number
}

type SymAlgPaddingMode = 0 | 1 | 2 | 3
// 0: 验证时间 1:验证时间和根证书签名 2:验证时间、根证书签名和CRL
type VerifyCertLevel = 0 | 1 | 2


type MacAlg = 'QK_HMAC_SM3'
              | 'QK_CBC_MAC_SM4'
// 时间戳解析项,参考《GM/T 0033-2014 时间戳接口规范》
type ItemNum = 'QK_ITEMNUM_UNSPECIFIED'
              | 'QK_STF_TIME_OF_STAMP'
              | 'QK_STF_CN_OF_TSSIGNER'
              | 'QK_STF_ORINGINAL_DATA'
              | 'QK_STF_CERT_OF_TSSERVER'
              | 'QK_STF_CERTCHAIN_OF_TSSERVER'
              | 'QK_STF_SOURCE_OF_TIME'
              | 'QK_STF_TIME_PRECISION'
              | 'QK_STF_RESPONSE_TYPE'
              | 'QK_STF_SUBJECT_COUNTRY_OF_TSSIGNER'
              | 'QK_STF_SUBJECT_ORGNIZATION_OF_TSSIGNER'
              | 'QK_STF_SUBJECT_CITY_OF_TSSIGNER'
              | 'QK_STF_SUBJECT_EMAIL_OF_TSSIGNER'

/* 对称加密
-----------------------------------------*/
export interface SymmEncryptRequest {
  plainText: string; // 明文数据
  keyId?: string; // key ID
  alg?: string; // 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
  iv?: string; // IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
  padding?: SymAlgPaddingMode; // padding填充模式
}
 
export interface SymmEncryptResponse{
  cipherText: Buffer // 密文数据
}

/* 对称解密
-----------------------------------------*/
export interface SymmDecryptRequest {
  cipherText: Buffer; // 密文数据
  keyId?: string; // key ID
  alg?: string; // 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
  iv?: string; // IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
  padding?: SymAlgPaddingMode; // padding填充模式
}
export interface SymmDecryptResponse {
  plainText: string; // 明文数据
}

/* 非对称加密
-----------------------------------------*/
export interface AsymEncryptRequest{
  plainText: string, // 明文数据
  certId?: string // 证书标识，若为空则使用应用默认证书
}
export interface AsymEncryptResponse{
  cipherText: Buffer // 密文数据
}

/* 非对称解密
-----------------------------------------*/
export interface AsymDecryptRequest {
  cipherText: Buffer; // 密文数据
}
export interface AsymDecryptResponse {
  plainText: string;
}

/* 数字签名请求
-----------------------------------------*/
export interface SignDataRequest {
  plainText: string; // 原文
}
export interface SignDataResponse {
  signText: Buffer; // 签名值
}

/* 数字验签请求
-----------------------------------------*/
export interface VerifySignedDataRequest {
  plainText: string; // 原文
  signText: Buffer; // 签名值
  certId?: string; // 证书标识
  certPath?: string; // 证书数据地址,支持pem,der,base64
  verifyLevel?: VerifyCertLevel; // 证书验证级别
}
export interface VerifySignedDataResponse {
  verifyResult: boolean; // 验证结果
}

/* 计算MAC
-----------------------------------------*/
export interface CalculateMACRequest {
  keyId: string; // 共享密钥ID
  macAlg: MacAlg; // mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
  plainText: string; // 明文数据
}

// 计算MAC应答
export interface CalculateMACResponse {
  macText: Buffer;
}

/* 验证MAC
-----------------------------------------*/
export interface VerifyMACRequest {
  keyId: string; // 共享密钥ID
  macAlg: MacAlg; // mac 算法,暂只支持QK_HMAC_SM3,QK_CBC_MAC_SM4
  plainText: string; // 明文数据
  macText: Buffer; // mac值
}

// 验证MAC应答
export interface VerifyMACResponse {
  verifyResult: Boolean;
}

/* 数字信封方式对明文数据进行加密
-----------------------------------------*/
export interface EvpEncryptDataRequest {
  envelopeId: string; // 数字信封ID，长度建议为32字节的UUID，须用户生成
  receiverId: string; // 接收者ID，格式如：100000，六位数字
  plainText: string; // 明文数据
}
export interface EvpEncryptDataResponse {
  cipherText: Buffer; // 密文数据
}

/* 对数字信封加密的密文进行解密得到明文数据
-----------------------------------------*/
export interface EvpDecryptDataRequest {
  envelopeId: string; // 数字信封ID，长度建议为32字节的UUID，须用户生成
  cipherText: Buffer; // 密文数据
}
export interface EvpDecryptDataResponse {
  plainText: string; // 明文数据
}

/* 生成时间戳
-----------------------------------------*/
export interface CreateTSRequest {
  plainText: string;
}
export interface CreateTSResponse {
  tsText: Buffer;
}

/* 验证时间戳
-----------------------------------------*/
export interface VerifyTSRequest {
  tsText: Buffer;
}
export interface VerifyTSResponse {
  verifyResult: Boolean;
}

/* 解析时间戳信息
-----------------------------------------*/
export interface GetTSDetailInfoRequest {
  tsText: Buffer;
  itemNum: ItemNum;
}

export interface GetTSDetailInfoResponse {
  itemValue: Buffer;
}
