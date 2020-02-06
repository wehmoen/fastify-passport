"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("./strategies/session"));
const session_manager_1 = __importDefault(require("./session-manager"));
const authenticate_1 = __importDefault(require("./handlers/authenticate"));
const initialize_1 = __importDefault(require("./handlers/initialize"));
const fastifyPlugin = require("fastify-plugin");
class Authenticator {
    constructor() {
        this._strategies = {};
        this._serializers = [];
        this._deserializers = [];
        this._infoTransformers = [];
        this._key = 'passport';
        this._userProperty = 'user';
        this.use(new session_1.default(this.deserializeUser.bind(this)));
        this._sessionManager = new session_manager_1.default({ key: this._key }, this.serializeUser.bind(this));
    }
    use(name, strategy) {
        if (!strategy) {
            strategy = name;
            name = strategy.name;
        }
        if (!name) {
            throw new Error('Authentication strategies must have a name');
        }
        this._strategies[name] = strategy;
        return this;
    }
    unuse(name) {
        delete this._strategies[name];
        return this;
    }
    initialize(options) {
        return initialize_1.default(this, options);
    }
    authenticate(strategy, options, callback) {
        return authenticate_1.default(this, strategy, options, callback);
    }
    authorize(strategy, options, callback) {
        options = options || {};
        options.assignProperty = 'account';
        return authenticate_1.default(this, strategy, options, callback);
    }
    session(options) {
        const authenticate = authenticate_1.default(this, 'session', options);
        return fastifyPlugin(function session(fastify, opts, next) {
            fastify.addHook('preValidation', authenticate);
            next();
        });
    }
    serializeUser(fn, req, done) {
        if (typeof fn === 'function') {
            this._serializers.push(fn);
            return;
        }
        const user = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._serializers;
        (function pass(i, err, obj) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || obj || obj === 0) {
                return done(err, obj);
            }
            const layer = stack[i];
            if (!layer) {
                return done(new Error('Failed to serialize user into session'));
            }
            function serialized(e, o) {
                pass(i + 1, e, o);
            }
            try {
                const arity = layer.length;
                if (arity === 3) {
                    layer(req, user, serialized);
                }
                else {
                    layer(user, serialized);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    deserializeUser(fn, req, done) {
        if (typeof fn === 'function') {
            this._deserializers.push(fn);
            return;
        }
        const obj = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._deserializers;
        (function pass(i, err, user) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || user) {
                return done(err, user);
            }
            if (user === null || user === false) {
                return done(null, false);
            }
            const layer = stack[i];
            if (!layer) {
                return done(new Error('Failed to deserialize user out of session'));
            }
            function deserialized(e, u) {
                pass(i + 1, e, u);
            }
            try {
                const arity = layer.length;
                if (arity === 3) {
                    layer(req, obj, deserialized);
                }
                else {
                    layer(obj, deserialized);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    transformAuthInfo(fn, req, done) {
        if (typeof fn === 'function') {
            this._infoTransformers.push(fn);
            return;
        }
        const info = fn;
        if (typeof req === 'function') {
            done = req;
            req = undefined;
        }
        const stack = this._infoTransformers;
        (function pass(i, err, tinfo) {
            if ('pass' === err) {
                err = undefined;
            }
            if (err || tinfo) {
                return done(err, tinfo);
            }
            const layer = stack[i];
            if (!layer) {
                return done(null, info);
            }
            function transformed(e, t) {
                pass(i + 1, e, t);
            }
            try {
                const arity = layer.length;
                if (arity === 1) {
                    const t = layer(info);
                    transformed(null, t);
                }
                else if (arity === 3) {
                    layer(req, info, transformed);
                }
                else {
                    layer(info, transformed);
                }
            }
            catch (e) {
                return done(e);
            }
        })(0);
    }
    _strategy(name) {
        return this._strategies[name];
    }
}
exports.Authenticator = Authenticator;
exports.default = Authenticator;
//# sourceMappingURL=authenticator.js.map