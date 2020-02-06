"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("../strategies");
class SessionStrategy extends strategies_1.Strategy {
    constructor(options, deserializeUser) {
        super('session');
        if (typeof options === 'function') {
            deserializeUser = options;
            options = undefined;
        }
        options = options || {};
        this._deserializeUser = deserializeUser;
    }
    authenticate(request, options) {
        if (!request._passport) {
            return this.error(new Error('passport.initialize() plugin not in use'));
        }
        options = options || {};
        if (options.pauseStream) {
            return this.error(new Error("fastify-passport doesn't support pauseStream option."));
        }
        let sessionUser;
        if (request._passport.session) {
            sessionUser = request._passport.session.user;
        }
        if (sessionUser || sessionUser === 0) {
            this._deserializeUser(sessionUser, request, (err, user) => {
                if (err) {
                    return this.error(err);
                }
                if (!user) {
                    delete request._passport.session.user;
                }
                else {
                    const property = request._passport.instance._userProperty || 'user';
                    request[property] = user;
                }
                this.pass();
            });
        }
        else {
            this.pass();
        }
    }
}
exports.default = SessionStrategy;
//# sourceMappingURL=session.js.map