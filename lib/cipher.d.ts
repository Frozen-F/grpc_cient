import { Reply } from './constant/common';
import * as Cipler from './constant/cipher';
declare class CipherClient {
    private serve;
    constructor(option: Cipler.Option);
    init(): Promise<this>;
    close(): void;
    throw(err?: string): void;
    myProxy(method: string, ...arg: any[]): Promise<Reply<any>>;
    symmEncrypt({ plainText, keyId, alg, iv, padding }: Cipler.SymmEncryptRequest): Promise<Reply<Cipler.SymmEncryptResponse>>;
    symmDecrypt({ cipherText, keyId, alg, iv, padding }: Cipler.SymmDecryptRequest): Promise<Reply<Cipler.SymmDecryptResponse>>;
    asymEncrypt({ plainText, certId }: Cipler.AsymEncryptRequest): Promise<Reply<Cipler.AsymEncryptResponse>>;
    asymDecrypt({ cipherText }: Cipler.AsymDecryptRequest): Promise<Reply<Cipler.AsymDecryptResponse>>;
    signData({ plainText }: Cipler.SignDataRequest): Promise<Reply<Cipler.SignDataResponse>>;
    verifySignedData({ certId, plainText, signText, certPath, verifyLevel }: Cipler.VerifySignedDataRequest): Promise<Reply<Cipler.VerifySignedDataResponse>>;
    calculateMAC({ keyId, macAlg, plainText }: Cipler.CalculateMACRequest): Promise<Reply<Cipler.CalculateMACResponse>>;
    verifyMAC({ keyId, macAlg, plainText, macText }: Cipler.VerifyMACRequest): Promise<Reply<Cipler.VerifyMACResponse>>;
    evpEncryptData({ envelopeId, receiverId, plainText }: Cipler.EvpEncryptDataRequest): Promise<Reply<Cipler.EvpEncryptDataResponse>>;
    evpDecryptData({ envelopeId, cipherText }: Cipler.EvpDecryptDataRequest): Promise<Reply<Cipler.EvpDecryptDataResponse>>;
    createTS({ plainText }: Cipler.CreateTSRequest): Promise<Reply<Cipler.CreateTSResponse>>;
    verifyTS({ tsText }: Cipler.VerifyTSRequest): Promise<Reply<Cipler.VerifyTSResponse>>;
    getTSDetailInfo({ tsText, itemNum }: Cipler.GetTSDetailInfoRequest): Promise<Reply<Cipler.GetTSDetailInfoResponse>>;
}
export default CipherClient;
