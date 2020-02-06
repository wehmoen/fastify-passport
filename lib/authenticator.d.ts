/// <reference path="types/fastify/index.d.ts" />
/// <reference types="node" />
import SessionManager from './session-manager';
import { Strategy } from './strategies';
import { FastifyRequest } from 'fastify';
import { AuthenticateFactoryOptions } from './handlers/authenticate';
declare type DoneFunction = (err: null | Error | 'pass', user?: any) => void;
export declare class Authenticator {
    private _strategies;
    private _serializers;
    private _deserializers;
    private _infoTransformers;
    _key: string;
    _userProperty: string;
    _sessionManager: SessionManager;
    constructor();
    use(strategy: Strategy): this;
    use(name: string, strategy: Strategy): this;
    unuse(name: string): this;
    initialize(options?: {
        userProperty?: string;
    }): (instance: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse>, options: any, callback: (err?: import("fastify").FastifyError | undefined) => void) => void;
    authenticate(strategy: string, options?: AuthenticateFactoryOptions, callback?: any): (request: FastifyRequest<import("http").IncomingMessage, import("fastify").DefaultQuery, import("fastify").DefaultParams, import("fastify").DefaultHeaders, any>, reply: import("fastify").FastifyReply<import("http").ServerResponse>, next: any) => void;
    authorize(strategy: string, options?: any, callback?: any): (request: FastifyRequest<import("http").IncomingMessage, import("fastify").DefaultQuery, import("fastify").DefaultParams, import("fastify").DefaultHeaders, any>, reply: import("fastify").FastifyReply<import("http").ServerResponse>, next: any) => void;
    session(options?: AuthenticateFactoryOptions): (instance: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse>, options: any, callback: (err?: import("fastify").FastifyError | undefined) => void) => void;
    serializeUser(fn: ((user: any, done: DoneFunction) => void) | ((request: FastifyRequest, user: any, done: DoneFunction) => void)): void;
    serializeUser(user: any, done: DoneFunction): void;
    serializeUser(user: any, request: FastifyRequest, done: Function): void;
    deserializeUser(fn: ((user: any, done: DoneFunction) => void) | ((request: FastifyRequest, user: any, done: DoneFunction) => void)): void;
    deserializeUser(obj: any, done: DoneFunction): void;
    deserializeUser(obj: any, request: FastifyRequest, done: DoneFunction): void;
    transformAuthInfo(fn: ((info: any, done: DoneFunction) => void) | ((request: FastifyRequest, info: any, done: DoneFunction) => void)): void;
    transformAuthInfo(obj: any, done: DoneFunction): void;
    transformAuthInfo(obj: any, request: FastifyRequest, done: DoneFunction): void;
    _strategy(name: string): Strategy;
}
export default Authenticator;
