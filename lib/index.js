"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticator_1 = __importDefault(require("./authenticator"));
const passport = new authenticator_1.default();
exports.default = passport;
var strategies_1 = require("./strategies");
exports.Strategy = strategies_1.Strategy;
//# sourceMappingURL=index.js.map