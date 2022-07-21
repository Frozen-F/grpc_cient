export interface Option {
  addr: string,
  rootCertPath: string,
  privateKeyPath: string,
  authority?: string,
  timeout?: number
}

// 非对称加密请求
export interface AsymEncryptRequest{
  plainText: string, // 明文数据
  certId?: string // 证书标识，若为空则使用应用默认证书
}
// 非对称加密应答
export interface AsymEncryptResponse{
  cipherText: Buffer // 密文数据
}


// 非对称解密请求
export interface AsymDecryptRequest {
  cipherText: Buffer; // 密文数据
}
// 非对称解密应答
export interface AsymDecryptResponse {
  plainText: string;
}

// 对称加密
export interface SymmEncryptRequest {
  plainText: string; // 明文数据
  keyId?: string; // key ID
  alg?: string; // 对称加密算法,暂只支持QK_SGD_SM4_ECB,QK_SGD_SM4_CBC,默认值为QK_SGD_SM4_ECB
  iv?: string; // IV初始向量,当sym_alg为QK_SGD_SM4_CBC时有效,默认值为全0
  padding?: string; // padding填充模式
}

// 对称加密应答
export interface SymmEncryptResponse{
  cipherText: Buffer // 密文数据
}
