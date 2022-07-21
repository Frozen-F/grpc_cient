export interface Option {
    addr: string;
    rootCertPath: string;
    privateKeyPath: string;
    authority?: string;
    timeout?: number;
}
export interface HelloReply {
    message: string;
}
export interface HelloRequest {
    name: string;
}
export interface AsymEncryptResponse {
    status: {
        code: 0 | 1;
        msg: string;
    };
    plain_text: any;
}
export interface AsymEncryptRequest {
    plaintext: string;
    certId?: string;
}
