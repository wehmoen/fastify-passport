"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const decorators_1 = require("../decorators");
const fastify_flash_1 = __importDefault(require("fastify-flash"));
function initializeFactory(passport, options = {}) {
    return fastify_plugin_1.default(function initialize(fastify, opts, next) {
        fastify.register(fastify_flash_1.default);
        fastify.decorateRequest('_passport', { instance: passport });
        fastify.addHook('preValidation', preValidation());
        fastify.decorateRequest('logIn', decorators_1.logIn);
        fastify.decorateRequest('login', decorators_1.logIn);
        fastify.decorateRequest('logOut', decorators_1.logOut);
        fastify.decorateRequest('logout', decorators_1.logOut);
        fastify.decorateRequest('isAuthenticated', decorators_1.isAuthenticated);
        fastify.decorateRequest('isUnauthenticated', decorators_1.isUnauthenticated);
        fastify.decorateRequest(options.userProperty || 'user', null);
        next();
    });
}
exports.default = initializeFactory;
function preValidation() {
    return function passport(request, reply, done) {
        const sessionKey = request._passport.instance._key;
        request._passport.session = request.session[sessionKey];
        done();
    };
}
//# sourceMappingURL=initialize.js.map