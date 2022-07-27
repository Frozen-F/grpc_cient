"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePfx = void 0;
const parsePfx_1 = require("./parsePfx");
const parsePfx = (path, password = '') => __awaiter(void 0, void 0, void 0, function* () {
    if (!path)
        throw new Error('The path cannot be empty');
    const params = {
        path,
        password
    };
    return {
        privateKey: yield (0, parsePfx_1.getPrivateKey)(params),
        certificate: yield (0, parsePfx_1.getCertificate)(params)
    };
});
exports.parsePfx = parsePfx;
