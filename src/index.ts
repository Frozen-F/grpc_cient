/* *
 * 密码客户端实例
 * */
import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import { ChannelCredentials } from '@grpc/grpc-js';

import getClientOptions from './utils/clientOptions';
import { parsePfx } from './utils/pfxUtils';
import { camelCase } from './utils';

export interface Reply<T> {
  response: T | null,
  err: Error | null
}

export interface Config {
  PROTO_PATH: string, // proto文件地址
  PACKAGE_NAME: string; // proto文件对应package
  SERVE_NAME: string; // 服务名称
}
  
  
// 客户端配置
export interface ClientOption {
  uri: string | string[];
  config: Config; // proto配置
  ssl?: {
    rootCertPath?: string; // 根证书
    clientStorePath?: string; // 私钥和证书文件地址
    authority?: string; // grpc.ssl_target_name_override
    pfxCode?: string; // 私钥和证书文件（pfx）解析需要的密码
    isOpen: boolean; // 默认为false
  };
  timeout?: number; // 单次grpc timeout
}

/**
  * @param uri 加密服务的地址列表，格式为“IP:端口”，例如：new String[]{"192.168.1.1:8443", "192.168.1.2:8443"}
  * @param rootCertPath SDK客户端证书的CA根证书
  * @param KeyStorePath SDK客户端的证书与私钥文件
  * @param authority 密码服务名称（与服务证书的Common Name保持一致），默认为quickservice
  */
export class Client {
  private config:Config = {
    PROTO_PATH: '',
    PACKAGE_NAME: '',
    SERVE_NAME: ''
  };
  /** 加密服务的地址，格式为“IP:端口”，例如：192.168.1.1:8443 */
  private address: string | string[] = '';

  /** Timeout */
  private timeout : number = 2000;

  /** ssl配置信息 */
  private ssl = {
    isOpen: false,
    caPath: '', // 根证书
    clientStorePath: '', // 客户端私钥与证书
    pfxCode: '',
    authority: ''
  };

  /** 客户端实例 */
  public client: ServiceClient | null = null;

  constructor(option: ClientOption) {
    this.initOption(option);
  }

  /** 设置配置信息等 */
  private initOption({ uri, ssl, timeout = 2000, config }: ClientOption) {
    this.address = uri;
    this.timeout = timeout;
    const { rootCertPath, clientStorePath, pfxCode, authority, isOpen = false } = ssl || {};
    Object.assign(this.ssl, {
      isOpen,
      caPath: rootCertPath,
      clientStorePath,
      pfxCode,
      authority
    });
    Object.assign(this.config, config);
  }

  /** 初始化客户端 */
  public async init() {
    const { address, timeout, ssl, config } = this;
    const proto = this.getProto();
    const credentials = await this.getCredentials();
    this.client = new proto[config.SERVE_NAME](address, credentials, getClientOptions({ timeout, ssl }));
    return this;
  }

  /** 获取proto对象 */
  public getProto():Record<string, any> {
    const { PROTO_PATH, PACKAGE_NAME } = this.config;
    const packageDefinition = protoLoader.loadSync(
      PROTO_PATH,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
    let proto:any = grpc.loadPackageDefinition(packageDefinition);
    for (const key of PACKAGE_NAME.split('.')) {
      if (!proto[key]) break;
      proto = proto[key];
    }
    return proto;
  }

  /** 获取授权信息 */
  public async getCredentials(): Promise<ChannelCredentials> {
    const { isOpen, caPath, clientStorePath, pfxCode } = this.ssl;
    if (!isOpen) return grpc.credentials.createInsecure();
    const rootCerts = caPath ? fs.readFileSync(caPath) : null;
    const { privateKey, certificate } = await parsePfx(clientStorePath, pfxCode);
    return grpc.credentials.createSsl(rootCerts, Buffer.from(privateKey), Buffer.from(certificate));
  }

  /** 代理 */
  public myProxy(method:string, ...arg:any[]): Promise<Reply<any>> {
    return new Promise((resolve)=>{
      try {
        if (!this.client) throw Error('no client');
        this.client[method](...arg, (err:any, response:any)=>{
          if (response) {
            for (const key of Object.keys(response)) {
              const camelCaseKey = camelCase(key);
              if (key === camelCaseKey) continue;
              response[camelCaseKey] = response[key];
              delete response[key];
            }
          }
          resolve({
            err,
            response
          });
        });
      } catch (err: any) {
        resolve({
          response: null,
          err
        });
      }
    });
  }

  /** 关闭与密码服务的连接 */
  public close():void {
    if (!this.client) return;
    this.client.close();
  }

};

