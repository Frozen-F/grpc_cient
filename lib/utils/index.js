"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = void 0;
const camelCase = (str = '') => {
    const camelCaseRegex = /[-_\s]+(.)?/g;
    return str.replace(camelCaseRegex, (match, char) => {
        return char ? char.toUpperCase() : '';
    });
};
exports.camelCase = camelCase;
