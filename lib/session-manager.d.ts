import { FastifyRequest } from 'fastify';
declare class SessionManager {
    _key: string;
    _serializeUser: Function;
    constructor(options: Function | any, serializeUser: Function);
    logIn(request: FastifyRequest, user: any, cb: (err?: Error) => void): void;
    logOut(request: FastifyRequest, cb?: () => void): void;
}
export default SessionManager;
