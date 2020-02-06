"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const errors_1 = __importDefault(require("../errors"));
require("../types/fastify");
function authenticateFactory(passport, name, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    let multi = true;
    if (!Array.isArray(name)) {
        name = [name];
        multi = false;
    }
    function authenticate(request, reply, next) {
        const failures = [];
        function allFailed() {
            if (callback) {
                if (!multi) {
                    return callback(null, false, failures[0].challenge, failures[0].status);
                }
                else {
                    const challenges = failures.map(function (f) {
                        return f.challenge;
                    });
                    const statuses = failures.map(function (f) {
                        return f.status;
                    });
                    return callback(null, false, challenges, statuses);
                }
            }
            let failure = failures[0] || {};
            let challenge = failure.challenge || {};
            let msg;
            const authenticateOptions = options;
            if (authenticateOptions.failureFlash) {
                let flash = authenticateOptions.failureFlash;
                if (typeof flash === 'boolean') {
                    flash = challenge;
                }
                if (typeof flash === 'string') {
                    flash = { type: 'error', message: flash };
                }
                ;
                flash.type = flash.type || 'error';
                const type = flash.type || challenge.type || 'error';
                msg = flash.message || challenge.message || challenge;
                if (typeof msg === 'string') {
                    request.flash(type, msg);
                }
            }
            if (authenticateOptions.failureMessage) {
                msg = authenticateOptions.failureMessage;
                if (typeof msg === 'boolean') {
                    msg = challenge.message || challenge;
                }
                if (typeof msg === 'string') {
                    ;
                    request.session.messages = request.session.messages || [];
                    request.session.messages.push(msg);
                }
            }
            if (authenticateOptions.failureRedirect) {
                return reply.redirect(authenticateOptions.failureRedirect);
            }
            const rchallenge = [];
            let rstatus;
            let status;
            for (let j = 0, len = failures.length; j < len; j++) {
                failure = failures[j];
                challenge = failure.challenge;
                status = failure.status;
                rstatus = rstatus || status;
                if (typeof challenge === 'string') {
                    rchallenge.push(challenge);
                }
            }
            reply.code(rstatus || 401);
            if (reply.res.statusCode === 401 && rchallenge.length) {
                reply.header('WWW-Authenticate', rchallenge);
            }
            if (authenticateOptions.failWithError) {
                return next(new errors_1.default(http_1.default.STATUS_CODES[reply.res.statusCode], rstatus));
            }
            reply.send(http_1.default.STATUS_CODES[reply.res.statusCode]);
        }
        ;
        (function attempt(i) {
            const layer = name[i];
            if (!layer) {
                return allFailed();
            }
            const prototype = passport._strategy(layer);
            if (!prototype) {
                return next(new Error('Unknown authentication strategy "' + layer + '"'));
            }
            const strategy = Object.create(prototype);
            strategy.success = function (user, info) {
                if (callback) {
                    return callback(null, user, info);
                }
                info = info || {};
                let msg;
                const authenticateOptions = options;
                if (authenticateOptions.successFlash) {
                    let flash = authenticateOptions.successFlash;
                    if (typeof flash === 'boolean') {
                        flash = info || {};
                    }
                    if (typeof flash === 'string') {
                        flash = { type: 'success', message: flash };
                    }
                    flash.type = flash.type || 'success';
                    const type = flash.type || info.type || 'success';
                    msg = flash.message || info.message || info;
                    if (typeof msg === 'string') {
                        request.flash(type, msg);
                    }
                }
                if (authenticateOptions.successMessage) {
                    msg = authenticateOptions.successMessage;
                    if (typeof msg === 'boolean') {
                        msg = info.message || info;
                    }
                    if (typeof msg === 'string') {
                        ;
                        request.session.messages = request.session.messages || [];
                        request.session.messages.push(msg);
                    }
                }
                if (authenticateOptions.assignProperty) {
                    request[authenticateOptions.assignProperty] = user;
                    return next();
                }
                request.logIn(user, authenticateOptions, function (err) {
                    if (err) {
                        return next(err);
                    }
                    function complete() {
                        if (authenticateOptions.successReturnToOrRedirect) {
                            let url = authenticateOptions.successReturnToOrRedirect;
                            if (request.session && request.session.returnTo) {
                                url = request.session.returnTo;
                                delete request.session.returnTo;
                            }
                            return reply.redirect(url);
                        }
                        if (authenticateOptions.successRedirect) {
                            return reply.redirect(authenticateOptions.successRedirect);
                        }
                        next();
                    }
                    if (authenticateOptions.authInfo !== false) {
                        passport.transformAuthInfo(info, request, function (error, tinfo) {
                            if (error) {
                                return next(error);
                            }
                            request.authInfo = tinfo;
                            complete();
                        });
                    }
                    else {
                        complete();
                    }
                });
            };
            strategy.fail = function (challenge, status) {
                if (typeof challenge === 'number') {
                    status = challenge;
                    challenge = undefined;
                }
                failures.push({ challenge, status: status });
                attempt(i + 1);
            };
            strategy.redirect = function (url, status) {
                reply.status(status || 302);
                reply.redirect(url);
            };
            strategy.pass = function () {
                next();
            };
            strategy.error = function (err) {
                if (callback) {
                    return callback(err);
                }
                next(err);
            };
            strategy.authenticate(request, options);
        })(0);
    }
    return authenticate;
}
exports.default = authenticateFactory;
//# sourceMappingURL=authenticate.js.map