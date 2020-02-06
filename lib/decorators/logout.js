"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logOut() {
    let property = 'user';
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || 'user';
    }
    this[property] = null;
    if (this._passport) {
        this._passport.instance._sessionManager.logOut(this);
    }
}
exports.logOut = logOut;
//# sourceMappingURL=logout.js.map