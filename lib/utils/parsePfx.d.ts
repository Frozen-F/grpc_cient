interface Params {
    path: string;
    password: string;
}
declare function getAttributes(params: Params): Promise<any>;
declare function getPrivateKey(params: Params): Promise<any>;
declare function getCertificate(params: Params): Promise<any>;
export { getAttributes, getPrivateKey, getCertificate };
