export interface Config {
    PROTO_PATH: string;
    PACKAGE_NAME: string;
    SERVE_NAME: string;
}
export interface ClientOption {
    uri: string | string[];
    config: Config;
    ssl?: {
        rootCertPath?: string;
        clientStorePath?: string;
        authority?: string;
        pfxCode?: string;
        isOpen: boolean;
    };
    timeout?: number;
}
