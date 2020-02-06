/// <reference path="../types/fastify/index.d.ts" />
/// <reference types="node" />
import http from 'http';
import Authenticator from '../authenticator';
import { FastifyReply, FastifyRequest } from 'fastify';
import '../types/fastify';
declare type FlashObject = {
    type?: string;
    message?: string;
};
export interface AuthenticateFactoryOptions {
    scope?: string;
    failureFlash?: boolean | string | FlashObject;
    failureMessage?: boolean | string;
    successRedirect?: string;
    failureRedirect?: string;
    failWithError?: boolean;
    successFlash?: boolean | string | FlashObject;
    successMessage?: boolean | string;
    assignProperty?: string;
    successReturnToOrRedirect?: string;
    authInfo?: boolean;
    session?: boolean;
}
declare type AuthenticateFactoryCallback = (err: null | Error, user?: any, info?: any, statuses?: any | any[]) => void;
export default function authenticateFactory(passport: Authenticator, name: string | string[], options?: AuthenticateFactoryOptions | AuthenticateFactoryCallback, callback?: AuthenticateFactoryCallback): (request: FastifyRequest<http.IncomingMessage, import("fastify").DefaultQuery, import("fastify").DefaultParams, import("fastify").DefaultHeaders, any>, reply: FastifyReply<http.ServerResponse>, next: any) => void;
export {};
