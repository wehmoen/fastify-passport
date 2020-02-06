import { Strategy } from '../strategies';
import Authenticator from '../authenticator';
import { FastifyRequest } from 'fastify';
declare class SessionStrategy extends Strategy {
    private _deserializeUser;
    constructor(deserializeUser: Authenticator['deserializeUser']);
    constructor(options: any, deserializeUser: Authenticator['deserializeUser']);
    authenticate(request: FastifyRequest, options?: {
        pauseStream?: boolean;
    }): void;
}
export default SessionStrategy;
