"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionManager {
    constructor(options, serializeUser) {
        if (typeof options === 'function') {
            serializeUser = options;
            options = undefined;
        }
        options = options || {};
        this._key = options.key || 'passport';
        this._serializeUser = serializeUser;
    }
    logIn(request, user, cb) {
        const self = this;
        this._serializeUser(user, request, function (err, obj) {
            if (err) {
                return cb(err);
            }
            if (!request._passport.session) {
                request._passport.session = {};
            }
            request._passport.session.user = obj;
            if (!request.session) {
                request.session = {};
            }
            request.session[self._key] = request._passport.session;
            cb();
        });
    }
    logOut(request, cb) {
        if (request._passport && request._passport.session) {
            delete request._passport.session.user;
        }
        if (cb) {
            cb();
        }
    }
}
exports.default = SessionManager;
//# sourceMappingURL=session-manager.js.map