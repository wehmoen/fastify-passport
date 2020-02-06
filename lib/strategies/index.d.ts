import { FastifyRequest } from 'fastify';
export declare class Strategy {
    name: string;
    constructor(name: string);
    authenticate(request: FastifyRequest, options?: any): void;
    success?: AugmentedStrategy['success'];
    fail?: AugmentedStrategy['fail'];
    redirect?: AugmentedStrategy['redirect'];
    pass?: AugmentedStrategy['pass'];
    error?: AugmentedStrategy['error'];
}
export interface AugmentedStrategy {
    name: string;
    _deserializeUser?: Function;
    authenticate(request: FastifyRequest, options?: any): void;
    success(user: any, info?: any): void;
    fail(challenge?: any, status?: number): void;
    fail(status: number): void;
    redirect(url: string, status?: number): void;
    pass(): void;
    error(err: Error): void;
}
export default Strategy;
