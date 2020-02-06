"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Strategy {
    constructor(name) {
        this.name = name;
    }
    authenticate() {
        throw new Error('Strategy#authenticate must be overridden by subclass');
    }
}
exports.Strategy = Strategy;
exports.default = Strategy;
//# sourceMappingURL=index.js.map