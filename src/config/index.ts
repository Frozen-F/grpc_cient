const path = require('path');

const config = {
  PROTO_PATH: path.join(__dirname, '../../protos/CryptoService.proto'),
  PACKAGE_NAME: 'quick.api.grpc.v1',
  SERVE_NAME: 'CryptoService',
  PFX_CODE: 'qianxin.quick.50843197'
};

export default config;
