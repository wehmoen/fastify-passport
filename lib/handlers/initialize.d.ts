/// <reference path="../types/fastify/index.d.ts" />
/// <reference types="node" />
/// <reference types="fastify" />
import Authenticator from '../authenticator';
import { ServerResponse } from 'http';
export default function initializeFactory(passport: Authenticator, options?: {
    userProperty?: string;
}): (instance: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, ServerResponse>, options: any, callback: (err?: import("fastify").FastifyError | undefined) => void) => void;
